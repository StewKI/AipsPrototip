namespace TestBackend.Models;

public abstract record DrawingElement(
    string Id,
    string Type,
    string Color
);

public record Rectangle(
    string Id,
    string Color,
    double X,
    double Y,
    double Width,
    double Height
) : DrawingElement(Id, "rectangle", Color);

public record Line(
    string Id,
    string Color,
    double X1,
    double Y1,
    double X2,
    double Y2
) : DrawingElement(Id, "line", Color);

public record Arrow(
    string Id,
    string Color,
    double X1,
    double Y1,
    double X2,
    double Y2
) : DrawingElement(Id, "arrow", Color);

public record Text(
    string Id,
    string Color,
    double X,
    double Y,
    string Content
) : DrawingElement(Id, "text", Color);
