using AipsCore.Domain.Common.Validation;
using AipsCore.Domain.Common.Validation.Rules;

namespace AipsCore.Domain.Common.ValueObjects;

public record Email(string EmailValue) : AbstractValueObject
{
    protected override ICollection<AbstractRule> GetValidationRules()
    {
        return
        [
            new EmailRule(EmailValue)
        ];
    }
}