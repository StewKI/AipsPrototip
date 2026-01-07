using AipsCore.Domain.Common.Validation;

namespace AipsCore.Domain.Common.ValueObjects;

public record DomainId : AbstractValueObject
{
    public string IdValue { get; init; }

    public DomainId(string IdValue)
    {
        this.IdValue = IdValue;
        Validate();
    }

    protected override ICollection<AbstractRule> GetValidationRules()
    {
        return [];
    }
}