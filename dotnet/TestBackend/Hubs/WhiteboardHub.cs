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
            Elements = whiteboard.Elements.ToList()
        };
    }

    public async Task LeaveWhiteboard(string code)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, code);
    }

    public async Task DrawRectangle(string code, double x, double y, double width, double height, string color)
    {
        var rectangle = new Rectangle(
            Id: Guid.NewGuid().ToString(),
            Color: color,
            X: x,
            Y: y,
            Width: width,
            Height: height
        );
        _whiteboardService.AddElement(code, rectangle);
        await Clients.Group(code).SendAsync("ElementDrawn", rectangle);
    }

    public async Task DrawLine(string code, double x1, double y1, double x2, double y2, string color)
    {
        var line = new Line(
            Id: Guid.NewGuid().ToString(),
            Color: color,
            X1: x1,
            Y1: y1,
            X2: x2,
            Y2: y2
        );
        _whiteboardService.AddElement(code, line);
        await Clients.Group(code).SendAsync("ElementDrawn", line);
    }

    public async Task DrawArrow(string code, double x1, double y1, double x2, double y2, string color)
    {
        var arrow = new Arrow(
            Id: Guid.NewGuid().ToString(),
            Color: color,
            X1: x1,
            Y1: y1,
            X2: x2,
            Y2: y2
        );
        _whiteboardService.AddElement(code, arrow);
        await Clients.Group(code).SendAsync("ElementDrawn", arrow);
    }

    public async Task DrawText(string code, double x, double y, string content, string color)
    {
        var text = new Text(
            Id: Guid.NewGuid().ToString(),
            Color: color,
            X: x,
            Y: y,
            Content: content
        );
        _whiteboardService.AddElement(code, text);
        await Clients.Group(code).SendAsync("ElementDrawn", text);
    }
}
