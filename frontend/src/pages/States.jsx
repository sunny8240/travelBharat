import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LottiePlaceholder from "../component/LottiePlaceholder";
import { LocationIcon, PinIcon } from "../component/Icons";
import { useStates } from '../hooks/useApi';

export default function States() {
  const navigate = useNavigate();
  const { states, loading, error } = useStates();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStates, setFilteredStates] = useState([]);

  useEffect(() => {
    if (states.length > 0) {
      const filtered = states.filter(state =>
        state.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStates(filtered);
    }
  }, [states, searchQuery]);

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading states...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <iframe
          src="https://lottie.host/embed/f9ebd175-d47d-4f53-bcb5-9cc100bdfe13/a6aMlzIDaZ.lottie"
          title="No data animation"
          style={{ border: 'none', width: '100%', maxWidth: '480px', height: '360px', margin: '0 auto' }}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', background: 'var(--paper)' }}>
      <section style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)',
        color: 'var(--paper)',
        padding: '60px 40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: 'var(--heading)',
          fontSize: '3rem',
          marginBottom: '16px'
        }}>
          Explore Indian States
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Discover {filteredStates.length} states and union territories
        </p>
      </section>

      <section style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Search states..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '1rem',
            border: '2px solid var(--accent)',
            borderRadius: '8px',
            marginBottom: '30px'
          }}
        />
      </section>

      <section style={{
        padding: '40px 40px 60px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {filteredStates.map(state => (
            <div
              key={state._id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/states/${state.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/states/${state.slug}`);
                }
              }}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '420px',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-16px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 24px 48px rgba(155, 74, 26, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={{ 
                position: 'relative', 
                height: '240px', 
                overflow: 'hidden', 
                background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 100%)'
              }}>
                {state.images && state.images.length > 0 ? (
                  <>
                    <img
                      src={state.images[0]}
                      alt={state.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onError={(e) => { e.target.src = '/error.svg'; }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.12) rotate(0.5deg)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1) rotate(0)'}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(48deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                      pointerEvents: 'none'
                    }}></div>
                  </>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                  }}>
                    <LocationIcon size={64} color="rgba(155, 74, 26, 0.3)" />
                  </div>
                )}

                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
                  pointerEvents: 'none'
                }}></div>

                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    background: state.type === 'UT' ? 'rgba(59, 130, 246, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '7px 14px',
                    borderRadius: '24px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {state.type}
                  </div>
                </div>


                {state.capital && (
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 12px',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <PinIcon size={16} color="var(--accent)" />
                    {state.capital}
                  </div>
                )}
              </div>

              <div style={{ 
                padding: '24px', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <h3 style={{
                      fontFamily: 'var(--heading)',
                      fontSize: '1.5rem',
                      color: 'var(--dark)',
                      margin: '0',
                      fontWeight: '700',
                      letterSpacing: '-0.5px'
                    }}>
                      {state.name}
                    </h3>
                  </div>


                  <p style={{
                    fontSize: '0.95rem',
                    color: '#6b7280',
                    lineHeight: '1.5',
                    margin: '0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '48px'
                  }}>
                    {state.description || 'Explore the unique charm and culture of this destination.'}
                  </p>
                </div>

                <div style={{
                  marginTop: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, var(--accent) 0%, rgba(155, 74, 26, 0.85) 100%)',
                    color: 'white',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: 'fit-content',
                    boxShadow: '0 4px 12px rgba(155, 74, 26, 0.25)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.gap = '12px';
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 74, 26, 0.35)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.gap = '8px';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(155, 74, 26, 0.25)';
                  }}>
                    <span>Discover</span>
                    <span style={{ fontSize: '1rem', fontWeight: '700' }}>→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStates.length === 0 && (
          <LottiePlaceholder
            title="No States Found"
            message="Try searching with a different keyword."
          />
        )}
      </section>
    </div>
  );
}
