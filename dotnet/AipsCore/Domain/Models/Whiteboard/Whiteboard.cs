using AipsCore.Domain.Models.User.ValueObjects;
using AipsCore.Domain.Models.Whiteboard.ValueObjects;

namespace AipsCore.Domain.Models.Whiteboard;

public class Whiteboard
{
    public WhiteboardId Id { get; private set; }
    public WhiteboardCode Code { get; private set; }
    public UserId WhiteboardOwnerId { get; private set; }

    public Whiteboard(WhiteboardId id, WhiteboardCode code, UserId whiteboardOwnerId)
    {
        Id = id;
        Code = code;
        WhiteboardOwnerId = whiteboardOwnerId;
    }
}