namespace TestBackend.Models;

public class Whiteboard
{
    public required string Code { get; init; }
    public List<Circle> Circles { get; } = [];
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}
