using System.Collections.Concurrent;
using TestBackend.Models;

namespace TestBackend.Services;

public class WhiteboardService
{
    private readonly ConcurrentDictionary<string, Whiteboard> _whiteboards = new();
    private static readonly Random _random = new();

    public string CreateWhiteboard()
    {
        string code;
        do
        {
            code = GenerateCode();
        } while (!_whiteboards.TryAdd(code, new Whiteboard { Code = code }));

        return code;
    }

    public Whiteboard? GetWhiteboard(string code)
    {
        _whiteboards.TryGetValue(code, out var whiteboard);
        return whiteboard;
    }

    public bool WhiteboardExists(string code)
    {
        return _whiteboards.ContainsKey(code);
    }

    public DrawingElement AddElement(string whiteboardCode, DrawingElement element)
    {
        if (!_whiteboards.TryGetValue(whiteboardCode, out var whiteboard))
            throw new InvalidOperationException("Whiteboard not found");

        lock (whiteboard.Elements)
        {
            whiteboard.Elements.Add(element);
        }

        return element;
    }

    private static string GenerateCode()
    {
        return _random.Next(10000000, 100000000).ToString();
    }
}
