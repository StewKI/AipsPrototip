# Collaborative Whiteboard

Real-time whiteboard aplikacija. Napravis whiteboard, podelis kod, i svi crtaju zajedno.

## Tech stack

- **Backend**: .NET 10 + SignalR + Entity Framework Core
- **Frontend**: React 19 + TypeScript + Vite
- **Database**: PostgreSQL 16
- **Infrastructure**: Docker, Portainer

## Pokretanje (Docker)

### Prerequisites

- Docker
- Docker Compose

### Development (sa hot reload)

```bash
cd docker
docker compose up
```

Ovo pokrece:
| Servis | URL | Opis |
|--------|-----|------|
| Frontend | http://localhost:5173 | Vite dev server (HMR) |
| Backend | http://localhost:5120 | .NET sa `dotnet watch` |
| PostgreSQL | localhost:5432 | Database |
| Portainer | http://localhost:9000 | Container management UI |

Edituj kod -> promene se automatski primenjuju.

### Production

```bash
cd docker
docker compose -f docker-compose.yml up
```

Frontend je na http://localhost:3000 (nginx).

### Environment variables

Kopiraj `.env.example` u `.env` i podesi vrednosti:

```bash
cd docker
cp .env.example .env
```

## Struktura projekta

```
AipsPrototip/
├── docker/
│   ├── docker-compose.yml          # Production setup
│   ├── docker-compose.override.yml # Dev overrides (auto-merged)
│   ├── nginx.conf                  # Frontend proxy config
│   └── .env                        # Environment variables
├── dotnet/
│   ├── TestBackend/                # API + SignalR hub
│   └── TestWorker/                 # Background worker (RabbitMQ)
└── react/                          # Frontend app
```

## Kako radi

1. Registruj se / uloguj se
2. Napravi whiteboard - dobijes 8-cifreni kod
3. Podeli kod sa nekim
4. Oni udju sa tim kodom
5. Svi crtaju (pravougaonici, linije, strelice, tekst), svi vide sve u realnom vremenu

## Testiranje

Otvori 2 taba, u jednom napravi whiteboard, kopiraj kod, u drugom unesi kod i udji. Crtaj i gledaj magiju.
