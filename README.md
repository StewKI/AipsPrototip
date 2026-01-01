# Collaborative Whiteboard

Ej Veljko, ovo ti je ona app za real-time crtanje krugova. Kliknes negde na canvas i svi koji su ulogovani na isti whiteboard vide krug odmah.

## Kako radi

1. Napravis whiteboard - dobijes 8-cifreni kod
2. Podelis kod sa nekim
3. Oni udju sa tim kodom
4. Svi klikcu i crtaju krugove, svi vide sve u realnom vremenu

## Pokretanje

Treba ti 2 terminala.

### Terminal 1 - Backend (.NET)

```bash
cd dotnet/TestBackend
dotnet run
```

Radi na `http://localhost:5120`

### Terminal 2 - Frontend (React)

```bash
cd react
npm install   # samo prvi put
npm run dev
```

Otvori `http://localhost:5173` u browseru.

## Testiranje

Otvori 2 taba (ili 2 browsera), u jednom napravi whiteboard, kopiraj kod, u drugom unesu kod i udji. Klikci po canvasu i gledaj magiju.

## Tech stack

- Backend: .NET 9 + SignalR
- Frontend: React 19 + TypeScript + Vite
- Komunikacija: WebSocket preko SignalR
