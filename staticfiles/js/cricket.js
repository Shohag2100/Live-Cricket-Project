async function loadCurrentMatches(){
  const container = document.getElementById('live-matches');
  if(!container) return;
  container.innerHTML = '<h3 style="color:var(--muted)">Loading current matches…</h3>';

  try{
    const res = await fetch('/api/cricket/matches/current/');
    if(!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if(!Array.isArray(data)){
      container.innerHTML = '<p>No matches available.</p>';
      return;
    }

    const list = document.createElement('div');
    list.style.display = 'grid';
    list.style.gridTemplateColumns = 'repeat(auto-fit,minmax(240px,1fr))';
    list.style.gap = '12px';

    data.forEach(m => {
      const card = document.createElement('div');
      card.className = 'feature';
      card.innerHTML = `
        <h4>${m.name || 'Match'}</h4>
        <p style="color:var(--muted);margin:6px 0">${m.team1 || ''} vs ${m.team2 || ''}</p>
        <p style="font-weight:600">Status: ${m.status || 'N/A'}</p>
        <p style="margin-top:8px">Score: ${m.score || '—'}</p>
        <div style="margin-top:8px"><a class='btn' href='/api/cricket/matches/${m.id}/score/'>Refresh Score</a></div>
      `;
      list.appendChild(card);
    });

    container.innerHTML = '<h3 style="margin-bottom:12px;color:var(--accent)">Current Matches</h3>';
    container.appendChild(list);

  }catch(err){
    console.error(err);
    container.innerHTML = '<p>Error loading matches.</p>';
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadCurrentMatches();
});
