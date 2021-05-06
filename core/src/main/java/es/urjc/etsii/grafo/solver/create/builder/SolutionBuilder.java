package es.urjc.etsii.grafo.solver.create.builder;

import es.urjc.etsii.grafo.io.Instance;
import es.urjc.etsii.grafo.solution.Solution;
import es.urjc.etsii.grafo.solver.annotations.InheritedComponent;

/**
 * How to generate empty solutions from a given instance.
 * Problem dependant, implement your own version
 */
@InheritedComponent
public abstract class SolutionBuilder<S extends Solution<I>, I extends Instance> {
    /**
     * Generate an solution with the parameters given by the user
     * @param i Instance used to build the empty solution
     * @return empty solution referencing the given instance
     */
     public abstract S initializeSolution(I i);
}