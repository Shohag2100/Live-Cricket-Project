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
        <div class="stream-slot" style="margin-top:8px;color:var(--muted)">Searching for stream...</div>
      `;
      list.appendChild(card);

      // For each match, request match-specific streams (more accurate than a generic 'cricket' search)
      (async function(match, slot){
        try{
          const sres = await fetch(`/api/cricket/streams/match_streams/?team1=${encodeURIComponent(match.team1||'')}&team2=${encodeURIComponent(match.team2||'')}`);
          if(!sres.ok) throw new Error('streams fetch failed');
          const streams = await sres.json();
          if(Array.isArray(streams) && streams.length>0){
            const st = streams[0];
            slot.innerHTML = `<a class='btn' href='${st.url}' target='_blank'>Watch: ${st.title}</a>`;
          } else {
            slot.innerHTML = '<span>No stream found</span>';
          }
        }catch(e){
          console.error(e);
          slot.innerHTML = '<span>Error finding stream</span>';
        }
      })(m, card.querySelector('.stream-slot'));
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
