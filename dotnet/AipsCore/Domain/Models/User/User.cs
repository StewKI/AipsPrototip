using AipsCore.Domain.Common.ValueObjects;
using AipsCore.Domain.Models.User.ValueObjects;

namespace AipsCore.Domain.Models.User;

public class User
{
    public DomainId Id { get; private set; }
    public Email Email { get; private set; }
    public Username Username { get; private set; }
}