using AipsCore.Domain.Common.Validation;

namespace AipsCore.Domain.Abstract;

public abstract record AbstractValueObject
{
    protected abstract ICollection<AbstractRule> GetValidationRules();

    protected void Validate()
    {
        var rules = GetValidationRules();
        var validator = new Validator(rules, ValueObjectName);
        
        validator.Validate();

        if (!validator.Success)
        {
            throw validator.GetValidationException();
        }
    }

    private string ValueObjectName => this.GetType().Name;
}