---
noEditThisPage: true
remarksTarget: PipeworkPhysical.ecschema.md
---

# PipeworkPhysical

This schema contains classes that are commonly used in various types piping networks.

## Entity Classes

### BendType

A _Bend_ is a `PipeFitting` with typically two `PipingPort`s used to change the direction of flow between connected `PipingComponent`s.

### CompressionPortType

A _CompressionPort_ is a `PipingPort` that allows connections among `PipingComponent`s just by compression. Additional accessories may be used to further seal or strengthen each connection.

### CrossType

A _Tee_ is a `PipeFitting`with more than three `PipingPort`s used to redistribute flow among them and/or to change the direction of flow between connected `PipingComponent`s.

### FlangedPortType

A _FlangedPort_ is a `PipingPort` that has a flange, typically with bolt holes, that enable connections among `PipingComponent`s.

### FlangeType

A _Flange_ is a `PipeFitting` that uses Flanged `PipingPort`s as their main connection mechanism.

### GroovedPortType

A _GroovedPort_ is a `PipingPort` that exhibits a groove that, by using additional accessories, enable connections among `PipingComponent`s.

### ReducerType

A _Reducer_ is a `PipeFitting` with typically two `PipingPort`s having different shapes or sizes. Reducers can also be used to change the direction of flow between connected `PipingComponent`s.

### SolderedPortType

A _SolderedPort_ is a `PipingPort` that is connected with another `PipingPort` by using soldering.

### SwedgePortType

A _SwedgePort_ is a `PipingPort` that...

### TeeType

A _Tee_ is a `PipeFitting`with three `PipingPort`s used to redistribute flow among them and/or to change the direction of flow between connected `PipingComponent`s.

### ThreadedPortType

A _ThreadedPort_ is a `PipingPort` that exhibits either a male or female threaded end connection into which an opposite _ThreadedPort_ fits.

### WeldedPortType

A _WeldedPort_ is a `PipingPort` that is connected to another `PipingPort` by welding means.