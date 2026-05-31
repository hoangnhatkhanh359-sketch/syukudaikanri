import React, { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, Calendar, Clock } from 'lucide-react'

function App() {
  const [homeworks, setHomeworks] = useState([])
  const [newHomework, setNewHomework] = useState({
    subject: '',
    task: '',
    dueDate: '',
    priority: 'medium'
  })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const saved = localStorage.getItem('homeworks')
    if (saved) {
      setHomeworks(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('homeworks', JSON.stringify(homeworks))
  }, [homeworks])

  const addHomework = (e) => {
    e.preventDefault()
    if (!newHomework.subject || !newHomework.task) return

    const homework = {
      id: Date.now(),
      ...newHomework,
      status: 'not_started',
      createdAt: new Date().toISOString()
    }
    setHomeworks([...homeworks, homework])
    setNewHomework({ subject: '', task: '', dueDate: '', priority: 'medium' })
  }

  const deleteHomework = (id) => {
    setHomeworks(homeworks.filter(h => h.id !== id))
  }

  const toggleStatus = (id) => {
    setHomeworks(homeworks.map(h => {
      if (h.id === id) {
        const statusOrder = ['not_started', 'in_progress', 'completed']
        const currentIndex = statusOrder.indexOf(h.status)
        const nextIndex = (currentIndex + 1) % statusOrder.length
        return { ...h, status: statusOrder[nextIndex] }
      }
      return h
    }))
  }

  const filteredHomeworks = homeworks.filter(h => {
    if (filter === 'all') return true
    return h.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'not_started': return '未着手'
      case 'in_progress': return '進行中'
      case 'completed': return '完了'
      default: return status
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return '高'
      case 'medium': return '中'
      case 'low': return '低'
      default: return priority
    }
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900">
          📚 宿題管理アプリ
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">新しい宿題を追加</h2>
          <form onSubmit={addHomework} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">教科</label>
                <input
                  type="text"
                  value={newHomework.subject}
                  onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="例: 数学"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">課題内容</label>
                <input
                  type="text"
                  value={newHomework.task}
                  onChange={(e) => setNewHomework({ ...newHomework, task: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="例: ページ52-54"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">提出期限</label>
                <input
                  type="date"
                  value={newHomework.dueDate}
                  onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
                <select
                  value={newHomework.priority}
                  onChange={(e) => setNewHomework({ ...newHomework, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              追加する
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-800">宿題一覧</h2>
            <div className="flex gap-2 flex-wrap">
              {['all', 'not_started', 'in_progress', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'すべて' : getStatusText(f)}
                </button>
              ))}
            </div>
          </div>

          {filteredHomeworks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">宿題がありません</p>
              <p className="text-sm mt-2">上のフォームから追加してください</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHomeworks.map((homework) => (
                <div
                  key={homework.id}
                  className={`border rounded-xl p-4 transition-all hover:shadow-md ${
                    homework.status === 'completed' ? 'bg-gray-50 opacity-75' : 'bg-white'
                  } ${isOverdue(homework.dueDate) && homework.status !== 'completed' ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">{homework.subject}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(homework.priority)}`}>
                          {getPriorityText(homework.priority)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(homework.status)}`}>
                          {getStatusText(homework.status)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{homework.task}</p>
                      {homework.dueDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className={isOverdue(homework.dueDate) && homework.status !== 'completed' ? 'text-red-600' : 'text-gray-500'} />
                          <span className={isOverdue(homework.dueDate) && homework.status !== 'completed' ? 'text-red-600 font-medium' : 'text-gray-600'}>
                            {isOverdue(homework.dueDate) && homework.status !== 'completed' ? '期限切れ: ' : '期限: '}
                            {new Date(homework.dueDate).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(homework.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="ステータスを変更"
                      >
                        {homework.status === 'completed' ? (
                          <CheckCircle2 size={24} className="text-green-600" />
                        ) : (
                          <Circle size={24} className="text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteHomework(homework.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="削除"
                      >
                        <Trash2 size={24} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>データはブラウザに保存されます</p>
        </div>
      </div>
    </div>
  )
}

export default App
