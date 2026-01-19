import React, { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, Plus, X, Check, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function BasketballGameOrganizer() {
  const [view, setView] = useState('home'); // home, create, game-detail, my-invites
  const [games, setGames] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  // Load data from persistent storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load current user
      const userResult = await window.storage.get('current-user');
      if (userResult) {
        setCurrentUser(JSON.parse(userResult.value));
      } else {
        // Create default user if none exists
        const defaultUser = { id: 'user-1', name: 'You', phone: '555-0100' };
        await window.storage.set('current-user', JSON.stringify(defaultUser));
        setCurrentUser(defaultUser);
      }

      // Load all players
      const playersResult = await window.storage.get('all-players');
      if (playersResult) {
        setAllPlayers(JSON.parse(playersResult.value));
      } else {
        // Initialize with sample players
        const samplePlayers = [
          { id: 'p1', name: 'Mike Johnson', phone: '555-0101' },
          { id: 'p2', name: 'Chris Lee', phone: '555-0102' },
          { id: 'p3', name: 'Jordan Smith', phone: '555-0103' },
          { id: 'p4', name: 'Alex Davis', phone: '555-0104' },
          { id: 'p5', name: 'Sam Wilson', phone: '555-0105' },
          { id: 'p6', name: 'Taylor Brown', phone: '555-0106' },
          { id: 'p7', name: 'Casey Martinez', phone: '555-0107' },
          { id: 'p8', name: 'Drew Anderson', phone: '555-0108' },
          { id: 'p9', name: 'Jamie White', phone: '555-0109' },
          { id: 'p10', name: 'Morgan Garcia', phone: '555-0110' },
          { id: 'p11', name: 'Riley Thompson', phone: '555-0111' },
          { id: 'p12', name: 'Avery Moore', phone: '555-0112' },
          { id: 'p13', name: 'Quinn Jackson', phone: '555-0113' },
          { id: 'p14', name: 'Reese Harris', phone: '555-0114' },
          { id: 'p15', name: 'Dakota Clark', phone: '555-0115' }
        ];
        await window.storage.set('all-players', JSON.stringify(samplePlayers));
        setAllPlayers(samplePlayers);
      }

      // Load games
      const gamesResult = await window.storage.get('games');
      if (gamesResult) {
        setGames(JSON.parse(gamesResult.value));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveGames = async (updatedGames) => {
    try {
      await window.storage.set('games', JSON.stringify(updatedGames));
      setGames(updatedGames);
    } catch (error) {
      console.error('Error saving games:', error);
    }
  };

  const addPlayer = async () => {
    if (!newPlayerName.trim()) return;
    
    const newPlayer = {
      id: `p${Date.now()}`,
      name: newPlayerName.trim(),
      phone: `555-${Math.floor(1000 + Math.random() * 9000)}`
    };
    
    const updatedPlayers = [...allPlayers, newPlayer];
    setAllPlayers(updatedPlayers);
    await window.storage.set('all-players', JSON.stringify(updatedPlayers));
    setNewPlayerName('');
    setShowAddPlayer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {view === 'home' && <HomeView 
        setView={setView} 
        games={games} 
        currentUser={currentUser}
        allPlayers={allPlayers}
      />}
      {view === 'create' && <CreateGameView 
        setView={setView} 
        games={games}
        saveGames={saveGames}
        currentUser={currentUser}
        allPlayers={allPlayers}
        showAddPlayer={showAddPlayer}
        setShowAddPlayer={setShowAddPlayer}
        newPlayerName={newPlayerName}
        setNewPlayerName={setNewPlayerName}
        addPlayer={addPlayer}
      />}
      {view === 'my-invites' && <MyInvitesView 
        setView={setView}
        games={games}
        saveGames={saveGames}
        currentUser={currentUser}
      />}
      {view.startsWith('game-') && <GameDetailView 
        setView={setView}
        games={games}
        saveGames={saveGames}
        gameId={view.split('-')[1]}
        currentUser={currentUser}
      />}
    </div>
  );
}

function HomeView({ setView, games, currentUser, allPlayers }) {
  const myGames = games.filter(g => g.organizerId === currentUser?.id);
  const myInvites = games.filter(g => {
    const invite = g.invites.find(inv => inv.playerId === currentUser?.id);
    return invite && invite.status === 'pending';
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-900 mb-2">🏀 Pickup Ball</h1>
        <p className="text-orange-700">Organize games without the group chat chaos</p>
      </div>

      <div className="grid gap-4 mb-6">
        <button
          onClick={() => setView('create')}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl p-6 flex items-center justify-center gap-3 shadow-lg transition-all"
        >
          <Plus size={24} />
          <span className="text-xl font-semibold">Create New Game</span>
        </button>

        {myInvites.length > 0 && (
          <button
            onClick={() => setView('my-invites')}
            className="bg-white hover:bg-orange-50 text-orange-900 rounded-xl p-6 flex items-center justify-between shadow-lg transition-all border-2 border-orange-200"
          >
            <div className="flex items-center gap-3">
              <Clock size={24} />
              <span className="text-xl font-semibold">My Invites</span>
            </div>
            <span className="bg-orange-600 text-white rounded-full px-3 py-1 text-sm font-bold">
              {myInvites.length}
            </span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-orange-900 mb-4">My Games</h2>
        {myGames.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No games created yet</p>
        ) : (
          <div className="space-y-3">
            {myGames.map(game => (
              <GameCard key={game.id} game={game} onClick={() => setView(`game-${game.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateGameView({ setView, games, saveGames, currentUser, allPlayers, showAddPlayer, setShowAddPlayer, newPlayerName, setNewPlayerName, addPlayer }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [playersNeeded, setPlayersNeeded] = useState(10);
  const [priorityList, setPriorityList] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState(allPlayers);

  const addToPriorityList = (player) => {
    setPriorityList([...priorityList, player]);
    setAvailablePlayers(availablePlayers.filter(p => p.id !== player.id));
  };

  const removeFromPriorityList = (player) => {
    setPriorityList(priorityList.filter(p => p.id !== player.id));
    setAvailablePlayers([...availablePlayers, player]);
  };

  const movePriority = (index, direction) => {
    const newList = [...priorityList];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setPriorityList(newList);
  };

  const createGame = async () => {
    if (!date || !time || !location || priorityList.length === 0) {
      alert('Please fill in all fields and add at least one player');
      return;
    }

    const newGame = {
      id: `game-${Date.now()}`,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      date,
      time,
      location,
      playersNeeded,
      priorityList: priorityList.map(p => p.id),
      invites: [],
      confirmed: [],
      declined: []
    };

    // Send invites to first batch
    const firstBatch = priorityList.slice(0, playersNeeded);
    newGame.invites = firstBatch.map(player => ({
      playerId: player.id,
      playerName: player.name,
      status: 'pending',
      sentAt: new Date().toISOString()
    }));

    const updatedGames = [...games, newGame];
    await saveGames(updatedGames);
    setView(`game-${newGame.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => setView('home')}
        className="mb-6 text-orange-600 hover:text-orange-700 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-orange-900 mb-6">Create New Game</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Lincoln Park Courts"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Players Needed</label>
            <input
              type="number"
              value={playersNeeded}
              onChange={(e) => setPlayersNeeded(parseInt(e.target.value))}
              min="2"
              max="20"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Priority List ({priorityList.length})</h3>
            <button
              onClick={() => setShowAddPlayer(!showAddPlayer)}
              className="text-orange-600 hover:text-orange-700 text-sm flex items-center gap-1"
            >
              <Plus size={16} /> Add Player
            </button>
          </div>
          
          {showAddPlayer && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Player name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
              <button
                onClick={addPlayer}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-3">
            Order players by priority. First {playersNeeded} will be invited immediately.
          </p>

          {priorityList.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              Add players from the list below
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {priorityList.map((player, index) => (
                <div key={player.id} className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg">
                  <span className="font-bold text-orange-600 w-8">{index + 1}.</span>
                  <span className="flex-1">{player.name}</span>
                  {index < playersNeeded && (
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">
                      1st wave
                    </span>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => movePriority(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-orange-200 rounded disabled:opacity-30"
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button
                      onClick={() => movePriority(index, 'down')}
                      disabled={index === priorityList.length - 1}
                      className="p-1 hover:bg-orange-200 rounded disabled:opacity-30"
                    >
                      <ChevronDown size={20} />
                    </button>
                    <button
                      onClick={() => removeFromPriorityList(player)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Players</h3>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {availablePlayers.map(player => (
              <button
                key={player.id}
                onClick={() => addToPriorityList(player)}
                className="text-left p-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors border border-gray-200 hover:border-orange-300"
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={createGame}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-all"
        >
          Create Game & Send Invites
        </button>
      </div>
    </div>
  );
}

function MyInvitesView({ setView, games, saveGames, currentUser }) {
  const myInvites = games.filter(g => {
    const invite = g.invites.find(inv => inv.playerId === currentUser?.id);
    return invite && invite.status === 'pending';
  });

  const respondToInvite = async (gameId, response) => {
    const updatedGames = await Promise.all(games.map(async (game) => {
      if (game.id !== gameId) return game;

      const invite = game.invites.find(inv => inv.playerId === currentUser.id);
      if (!invite) return game;

      invite.status = response;

      if (response === 'accepted') {
        game.confirmed.push({
          playerId: currentUser.id,
          playerName: currentUser.name,
          confirmedAt: new Date().toISOString()
        });

        // Check if we need more players
        if (game.confirmed.length < game.playersNeeded) {
          // Find next player in priority list who hasn't been invited
          const invitedIds = game.invites.map(inv => inv.playerId);
          const nextPlayerId = game.priorityList.find(id => !invitedIds.includes(id));
          
          if (nextPlayerId) {
            const allPlayers = JSON.parse(localStorage.getItem('all-players') || '[]');
            const nextPlayer = allPlayers.find(p => p.id === nextPlayerId);
            if (nextPlayer) {
              game.invites.push({
                playerId: nextPlayer.id,
                playerName: nextPlayer.name,
                status: 'pending',
                sentAt: new Date().toISOString()
              });
            }
          }
        }
      } else {
        game.declined.push({
          playerId: currentUser.id,
          playerName: currentUser.name,
          declinedAt: new Date().toISOString()
        });

        // Send invite to next player
        const invitedIds = game.invites.map(inv => inv.playerId);
        const nextPlayerId = game.priorityList.find(id => !invitedIds.includes(id));
        
        if (nextPlayerId) {
          const allPlayersResult = await window.storage.get('all-players');
          const allPlayers = allPlayersResult ? JSON.parse(allPlayersResult.value) : [];
          const nextPlayer = allPlayers.find(p => p.id === nextPlayerId);
          if (nextPlayer) {
            game.invites.push({
              playerId: nextPlayer.id,
              playerName: nextPlayer.name,
              status: 'pending',
              sentAt: new Date().toISOString()
            });
          }
        }
      }

      return game;
    }));

    await saveGames(updatedGames);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => setView('home')}
        className="mb-6 text-orange-600 hover:text-orange-700 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-orange-900 mb-6">My Invites</h2>

        {myInvites.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No pending invites</p>
        ) : (
          <div className="space-y-4">
            {myInvites.map(game => {
              const invite = game.invites.find(inv => inv.playerId === currentUser.id);
              return (
                <div key={game.id} className="border border-orange-200 rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Game organized by {game.organizerName}
                    </h3>
                    <div className="space-y-1 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{game.date} at {game.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{game.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{game.confirmed.length} / {game.playersNeeded} confirmed</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => respondToInvite(game.id, 'accepted')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <Check size={20} /> I'm In
                    </button>
                    <button
                      onClick={() => respondToInvite(game.id, 'declined')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <X size={20} /> Can't Make It
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function GameDetailView({ setView, games, saveGames, gameId, currentUser }) {
  const game = games.find(g => g.id === gameId);

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => setView('home')} className="mb-6 text-orange-600">
          ← Back
        </button>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-center text-gray-500">Game not found</p>
        </div>
      </div>
    );
  }

  const pendingInvites = game.invites.filter(inv => inv.status === 'pending');
  const isFull = game.confirmed.length >= game.playersNeeded;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => setView('home')}
        className="mb-6 text-orange-600 hover:text-orange-700 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-orange-900 mb-4">Game Details</h2>
          <div className="space-y-2 text-lg">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-orange-600" />
              <span>{game.date} at {game.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-orange-600" />
              <span>{game.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users size={20} className="text-orange-600" />
              <span>{game.confirmed.length} / {game.playersNeeded} players</span>
            </div>
          </div>
        </div>

        {isFull && (
          <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-6 text-center">
            <p className="text-green-800 font-semibold text-lg">✓ Game is full!</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Confirmed Players</h3>
          {game.confirmed.length === 0 ? (
            <p className="text-gray-500 italic">No confirmed players yet</p>
          ) : (
            <div className="space-y-2">
              {game.confirmed.map((player, index) => (
                <div key={player.playerId} className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                  <span className="font-bold text-green-600 w-8">{index + 1}.</span>
                  <span>{player.playerName}</span>
                  <Check className="ml-auto text-green-600" size={20} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Pending Invites</h3>
          {pendingInvites.length === 0 ? (
            <p className="text-gray-500 italic">No pending invites</p>
          ) : (
            <div className="space-y-2">
              {pendingInvites.map(invite => (
                <div key={invite.playerId} className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg">
                  <Clock className="text-yellow-600" size={20} />
                  <span>{invite.playerName}</span>
                  <span className="ml-auto text-sm text-gray-500">Waiting...</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {game.declined.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Declined</h3>
            <div className="space-y-2">
              {game.declined.map(player => (
                <div key={player.playerId} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <X className="text-gray-400" size={20} />
                  <span className="text-gray-600">{player.playerName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GameCard({ game, onClick }) {
  const isFull = game.confirmed.length >= game.playersNeeded;
  const statusColor = isFull ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  const statusText = isFull ? 'Full' : `${game.confirmed.length}/${game.playersNeeded}`;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-orange-50 hover:bg-orange-100 p-4 rounded-lg border border-orange-200 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold text-gray-900">{game.location}</div>
          <div className="text-sm text-gray-600">{game.date} at {game.time}</div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
          {statusText}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        {game.invites.filter(inv => inv.status === 'pending').length} pending invites
      </div>
    </button>
  );
}