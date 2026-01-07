using AipsCore.Domain.Common.Validation;
using AipsCore.Domain.Common.Validation.Rules;
using AipsCore.Domain.Common.ValueObjects;

namespace AipsCore.Domain.Models.User.ValueObjects;

public record Username(string UsernameValue) : AbstractValueObject
{
    private const int MinimumLength = 8;
    private const int MaximumLength = 20;
    
    protected override ICollection<AbstractRule> GetValidationRules()
    {
        return
        [
            new MinLengthRule(UsernameValue, MinimumLength),
            new MaxLengthRule(UsernameValue, MaximumLength)
        ];
    }
}