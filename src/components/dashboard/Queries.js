import React, { useState } from 'react';

function Queries() {
  const [queries] = useState([
    {
      id: 1,
      subject: 'Product Inquiry',
      message: 'I would like to know more about your premium package.',
      from: 'john@example.com',
      status: 'New',
      date: '2024-03-15',
    },
    {
      id: 2,
      subject: 'Support Request',
      message: 'Having issues with the latest update.',
      from: 'sarah@example.com',
      status: 'In Progress',
      date: '2024-03-14',
    },
    {
      id: 3,
      subject: 'Partnership Opportunity',
      message: 'Interested in discussing potential collaboration.',
      from: 'mike@example.com',
      status: 'Resolved',
      date: '2024-03-13',
    },
  ]);

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [reply, setReply] = useState('');

  const getStatusColor = (status) => {
    const colors = {
      New: 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Resolved: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (reply.trim() && selectedQuery) {
      // Handle reply submission
      console.log('Reply to query:', selectedQuery.id, reply);
      setReply('');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Queries</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queries List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {queries.map((query) => (
                <div
                  key={query.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedQuery?.id === query.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedQuery(query)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{query.subject}</h3>
                      <p className="text-sm text-gray-500 mt-1">{query.from}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{query.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{query.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Query Details and Reply */}
        <div className="lg:col-span-2">
          {selectedQuery ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedQuery.subject}</h2>
                    <p className="text-sm text-gray-500 mt-1">From: {selectedQuery.from}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedQuery.status)}`}>
                    {selectedQuery.status}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700">{selectedQuery.message}</p>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Reply</h3>
                  <form onSubmit={handleReply}>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="input h-32"
                      placeholder="Type your reply..."
                      required
                    />
                    <div className="mt-4 flex justify-end">
                      <button type="submit" className="btn btn-primary">
                        Send Reply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Select a query to view details and reply
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Queries; 