---
noEditThisPage: true
remarksTarget: StructuralPhysicalInterop.ecschema.md
---

# StructuralPhysicalInterop

## Entity Classes

### IStructuralAssembly

Ideally, `IStructuralAssembly` should subclass both `IStructuralElement` and `bis:IParentElement`, since any class that mixes in `IStructuralAssembly` is expected to own child elements — as enforced through `StructuralAssemblyOwnsStructuralComponents` and `StructuralAssemblyOwnsStructuralAssembly`, both of which extend `bis:ElementOwnsChildElements`. However, EC currently restricts mixins to single inheritance, so `IStructuralAssembly` can only derive from `IStructuralElement`. Classes that mix in `IStructuralAssembly` should also mix in `bis:IParentElement` independently to formalize this expectation.
