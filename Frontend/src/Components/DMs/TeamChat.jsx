import React, { useState } from 'react';

const TeamChat = () => {
  const [selectedOption, setSelectedOption] = useState('group'); // 'group' or 'individual'
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    'Alice',
    'Bob',
    'Charlie',
    'David',
    'Eve',
    'Frank',
    'Grace',
    'Heidi',
    'Ivan',
    'Judy',
  ];

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setSelectedMember(null); // Reset selected member when switching options
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Team Messaging</h1>

      {/* Toggle Group/Individual */}
      <div className="flex justify-center mb-4">
        <div className="bg-white shadow-md rounded-full flex items-center p-1">
          <button
            onClick={() => handleOptionChange('group')}
            className={`px-4 py-2 rounded-full focus:outline-none ${
              selectedOption === 'group' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            Group Chat
          </button>
          <button
            onClick={() => handleOptionChange('individual')}
            className={`px-4 py-2 rounded-full focus:outline-none ${
              selectedOption === 'individual' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            Individual Chat
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-4 gap-4">
        {/* Sidebar - Team Members */}
        <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <ul>
            {teamMembers.map((member, index) => (
              <li
                key={index}
                className={`p-2 rounded-lg cursor-pointer ${
                  selectedMember === member ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleMemberClick(member)}
              >
                {member}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="col-span-3 bg-white rounded-lg shadow-md p-4">
          {selectedOption === 'group' ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Group Chat</h2>
              <p className="text-gray-700">This is the group chat area.</p>
            </div>
          ) : selectedMember ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Chat with {selectedMember}</h2>
              <p className="text-gray-700">This is the chat with {selectedMember}.</p>
            </div>
          ) : (
            <p className="text-gray-500">Select a team member to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
