using AipsCore.Domain.Common.Validation;
using AipsCore.Domain.Common.Validation.Rules;
using AipsCore.Domain.Common.ValueObjects;
using AipsCore.Domain.Models.Whiteboard.Validation;

namespace AipsCore.Domain.Models.Whiteboard.ValueObjects;

public record WhiteboardCode(string CodeValue) : AbstractValueObject
{
    private const int CodeLength = 8;
    
    protected override ICollection<AbstractRule> GetValidationRules()
    {
        return
        [
            new ExactLength(CodeValue, 8),
            new WhitebordCodeCharsetRule(CodeValue)
        ];
    }
} 