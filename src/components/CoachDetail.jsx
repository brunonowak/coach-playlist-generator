import { useState, useEffect } from 'react';
import { searchArtist, getArtistTopTracks } from '../spotify/api';

function CoachDetail({ token, coachName, onClose }) {
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const artists = await searchArtist(token, coachName);
        if (artists.length === 0) {
          setError('Artist not found on Spotify');
          setLoading(false);
          return;
        }
        const found = artists[0];
        setArtist(found);

        const topTracks = await getArtistTopTracks(token, found.id);
        setTracks(topTracks.slice(0, 5));
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    load();
  }, [token, coachName]);

  const formatFollowers = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal coach-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {loading && (
          <div className="playlist-progress">
            <div className="spinner" />
            <p>Loading {coachName}...</p>
          </div>
        )}

        {error && (
          <div className="playlist-error">
            <h3>😕 {coachName}</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && artist && (
          <>
            <div className="detail-header">
              {artist.images?.[0] && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="detail-photo"
                />
              )}
              <div className="detail-info">
                <h2>{artist.name}</h2>
                <p className="detail-followers">
                  {formatFollowers(artist.followers?.total ?? 0)} followers
                </p>
                {artist.genres?.length > 0 && (
                  <div className="detail-genres">
                    {artist.genres.slice(0, 4).map(g => (
                      <span key={g} className="genre-tag">{g}</span>
                    ))}
                  </div>
                )}
                <a
                  href={artist.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-spotify-link"
                >
                  Open in Spotify →
                </a>
              </div>
            </div>

            {tracks.length > 0 && (
              <div className="detail-tracks">
                <h3>Top Tracks</h3>
                <ul>
                  {tracks.map((t, i) => (
                    <li key={t.id} className="detail-track">
                      <span className="track-num">{i + 1}</span>
                      {t.album?.images?.[2] && (
                        <img
                          src={t.album.images[2].url}
                          alt={t.album.name}
                          className="track-album-art"
                        />
                      )}
                      <div className="track-info">
                        <span className="track-title">{t.name}</span>
                        <span className="track-album">{t.album.name}</span>
                      </div>
                      <span className="track-popularity" title="Popularity">
                        {t.popularity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CoachDetail;
