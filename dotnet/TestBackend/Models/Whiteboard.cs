namespace TestBackend.Models;

public class Whiteboard
{
    public required string Code { get; init; }
    public List<DrawingElement> Elements { get; } = [];
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}
