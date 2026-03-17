import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_BASE =
  process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
    : 'http://127.0.0.1:8000/api';

function useCollection(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/${endpoint}/`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const body = await res.json();
        if (mounted) {
          setData(Array.isArray(body) ? body : []);
        }
      } catch (e) {
        if (mounted) {
          setError('데이터를 불러오지 못했습니다. Django 서버를 확인하세요.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [endpoint]);

  return { data, loading, error };
}

function CollectionCard({ title, endpoint, fields }) {
  const { data, loading, error } = useCollection(endpoint);

  return (
    <section className="collection-card">
      <div className="card-head">
        <h2>{title}</h2>
        <span>{loading ? '로딩중' : `${data.length}건`}</span>
      </div>
      {error && <p className="error-text">{error}</p>}
      {!error && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {fields.map((field) => (
                  <th key={field}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row) => (
                <tr key={row.id}>
                  {fields.map((field) => (
                    <td key={`${row.id}-${field}`}>{String(row[field] ?? '-')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Dashboard() {
  const cards = useMemo(
    () => [
      { title: 'Users', endpoint: 'users', fields: ['id', 'name', 'email', 'team_name'] },
      { title: 'Teams', endpoint: 'teams', fields: ['id', 'name'] },
      {
        title: 'Activities',
        endpoint: 'activities',
        fields: ['id', 'user_name', 'activity_type', 'duration_minutes', 'calories_burned'],
      },
      { title: 'Leaderboard', endpoint: 'leaderboard', fields: ['id', 'user_name', 'points'] },
      { title: 'Workouts', endpoint: 'workouts', fields: ['id', 'user_name', 'title', 'difficulty'] },
    ],
    []
  );

  return (
    <main className="page-grid">
      {cards.map((card) => (
        <CollectionCard key={card.endpoint} {...card} />
      ))}
    </main>
  );
}

function About() {
  return (
    <section className="about-panel">
      <h2>Octofit Tracker</h2>
      <p>Marvel team과 DC team 기반 샘플 데이터로 API를 검증하는 피트니스 트래커입니다.</p>
      <p>
        백엔드 API: <strong>{API_BASE}</strong>
      </p>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="hero">
          <p className="eyebrow">Octofit Tracker</p>
          <h1>Fitness Data Control Room</h1>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
