using AipsCore.Domain.Common.Validation;

namespace AipsCore.Domain.Common.ValueObjects;

public record DomainId(string IdValue) : AbstractValueObject
{
    protected override ICollection<AbstractRule> GetValidationRules()
    {
        throw new NotImplementedException();
    }
}