package es.urjc.etsii.grafo.solver.improve.sa.cd;

import es.urjc.etsii.grafo.io.Instance;
import es.urjc.etsii.grafo.solution.Move;
import es.urjc.etsii.grafo.solution.Solution;
import es.urjc.etsii.grafo.solution.neighborhood.Neighborhood;

/**
 * Exponential coolDown strategy
 * @param <M>
 * @param <S>
 * @param <I>
 */
public class ExponentialCoolDown<M extends Move<S,I>, S extends Solution<S,I>, I extends Instance> implements CoolDownControl<M,S,I>{

    private final double ratio;

    public ExponentialCoolDown(double ratio){
        this.ratio = ratio;
    }

    @Override
    public double coolDown(S solution, Neighborhood<M, S, I> neighborhood, double currentTemperature, int iteration) {
        return currentTemperature * ratio;
    }
}