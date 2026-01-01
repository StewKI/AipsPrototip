using Microsoft.AspNetCore.SignalR;
using TestBackend.Models;
using TestBackend.Services;

namespace TestBackend.Hubs;

public class WhiteboardHub : Hub
{
    private readonly WhiteboardService _whiteboardService;

    public WhiteboardHub(WhiteboardService whiteboardService)
    {
        _whiteboardService = whiteboardService;
    }

    public async Task<string> CreateWhiteboard()
    {
        var code = _whiteboardService.CreateWhiteboard();
        await Groups.AddToGroupAsync(Context.ConnectionId, code);
        return code;
    }

    public async Task<object> JoinWhiteboard(string code)
    {
        var whiteboard = _whiteboardService.GetWhiteboard(code);
        if (whiteboard == null)
        {
            throw new HubException("Whiteboard not found");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, code);

        return new
        {
            whiteboard.Code,
            Circles = whiteboard.Circles.ToList()
        };
    }

    public async Task LeaveWhiteboard(string code)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, code);
    }

    public async Task DrawCircle(string code, double x, double y)
    {
        var circle = _whiteboardService.AddCircle(code, x, y);
        await Clients.Group(code).SendAsync("CircleDrawn", circle);
    }
}
