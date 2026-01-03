import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BudgetDashboard = () => {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    category: 'transport',
    amount: '',
    date: '',
    description: '',
  });
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    fetchBudget();
    fetchExpenses();
  }, [id]);

  const fetchBudget = async () => {
    try {
      const response = await axios.get(`/api/trips/${id}/budget`);
      setBudget(response.data);
    } catch (error) {
      console.error('Error fetching budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`/api/trips/${id}`);
      setExpenses(response.data.Expenses || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/trips/${id}/expenses`, newExpense);
      setNewExpense({
        category: 'transport',
        amount: '',
        date: '',
        description: '',
      });
      setShowAddExpense(false);
      fetchBudget();
      fetchExpenses();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add expense');
    }
  };

  if (loading || !budget) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  const pieData = Object.entries(budget.breakdown || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  }));

  const barData = Object.entries(budget.breakdown || {}).map(([name, value]) => ({
    name,
    amount: parseFloat(value),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Budget Dashboard</h1>
          <Link to={`/trips/${id}`} className="text-purple-400 hover:text-purple-300">
            ← Back to Trip
          </Link>
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          + Add Expense
        </button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">Budget Limit</p>
          <p className="text-3xl font-bold text-white">
            ${parseFloat(budget.budget_limit || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Spent</p>
          <p className="text-3xl font-bold text-white">
            ${parseFloat(budget.total_cost || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">Remaining</p>
          <p
            className={`text-3xl font-bold ${
              budget.remaining >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            ${parseFloat(budget.remaining || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">Percentage Used</p>
          <p className="text-3xl font-bold text-white">
            {parseFloat(budget.percentage_used || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Expense Breakdown</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${parseFloat(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-300">No expenses yet</div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Expenses by Category</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  formatter={(value) => `$${parseFloat(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none' }}
                />
                <Bar dataKey="amount" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-300">No expenses yet</div>
          )}
        </div>
      </div>

      {/* Expenses List */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Expenses</h2>
        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="glass-dark rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">{expense.category}</p>
                  {expense.description && (
                    <p className="text-gray-400 text-sm">{expense.description}</p>
                  )}
                  <p className="text-gray-500 text-xs">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xl font-bold text-white">
                  ${parseFloat(expense.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-300">No expenses recorded yet</div>
        )}
      </div>

      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <select
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg glass-dark border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="transport">Transport</option>
                <option value="stay">Stay</option>
                <option value="meals">Meals</option>
                <option value="activities">Activities</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg glass-dark border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
                required
                className="w-full px-4 py-2 rounded-lg glass-dark border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg glass-dark border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddExpense(false);
                    setNewExpense({
                      category: 'transport',
                      amount: '',
                      date: '',
                      description: '',
                    });
                  }}
                  className="flex-1 glass-dark px-6 py-2 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetDashboard;


