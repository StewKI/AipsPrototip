using AipsCore.Domain.Common.Validation;
using AipsCore.Domain.Common.Validation.Rules;
using AipsCore.Domain.Common.ValueObjects;
using AipsCore.Domain.Models.Whiteboard.Validation;

namespace AipsCore.Domain.Models.Whiteboard.ValueObjects;

public record WhiteboardCode : AbstractValueObject
{
    public string CodeValue { get; init; }
    
    public WhiteboardCode(string CodeValue)
    {
        this.CodeValue = CodeValue;
    }

    private const int CodeLength = 8;

    protected override ICollection<AbstractRule> GetValidationRules()
    {
        return
        [
            new ExactLength(CodeValue, CodeLength),
            new WhitebordCodeCharsetRule(CodeValue)
        ];
    }
} 