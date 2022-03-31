package es.urjc.etsii.grafo.solver.algorithms;

import es.urjc.etsii.grafo.io.Instance;
import es.urjc.etsii.grafo.solution.Solution;
import es.urjc.etsii.grafo.solver.create.Constructive;
import es.urjc.etsii.grafo.solver.improve.Improver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.BinaryOperator;

public class ScatterSearch<S extends Solution<S, I>, I extends Instance> extends Algorithm<S, I> {

    private static final Logger log = LoggerFactory.getLogger(ScatterSearch.class);

    private final int refsetSize;
    private final Constructive<S, I> constructive;
    private final Improver<S, I> improver;
    private final BinaryOperator<S> combinator;
    private final int maxIterations;
    private final Comparator<S> setSort;

    /**
     * @param refsetSize   Number of solutions to keep in refset
     * @param constructive Method used to generate the initial refset
     * @param improver     Method to improve any given solution, such as a local search
     * @param combinator   Creates a solution as a combination of two different solutions
     * @param maximizing true if this is a maximization problem, false otherwise
     * @param maxIterations Maximum number of newSets that can be generated before stopping
     */
    public ScatterSearch(int refsetSize, Constructive<S, I> constructive, Improver<S, I> improver, BinaryOperator<S> combinator, boolean maximizing, int maxIterations) {
        this.refsetSize = refsetSize;
        this.constructive = constructive;
        this.improver = improver;
        this.combinator = combinator;
        this.setSort = maximizing ? Comparator.comparing(S::getScore).reversed() : Comparator.comparing(S::getScore);
        this.maxIterations = maxIterations;
    }

    @Override
    public S algorithm(I instance) {
        var refset = initialRefSet(instance);
        refset.sort(this.setSort);
        int iterations = 0;
        while(iterations < maxIterations){
            var newSet = newSet(refset);
            var mergeResult = mergeSets(refset, newSet);
            refset = mergeResult.refset();
            if(!mergeResult.updated()){
                log.debug("Ending at iteration {} / {}, best found", iterations, maxIterations);
                break;
            }
            iterations++;
        }

        if(iterations == maxIterations){
            log.debug("Ending, maxiter of {} reached.", maxIterations);
        }
        var best = Solution.getBest(refset);
        return best;
    }

    protected List<S> initialRefSet(I instance) {
        List<S> initialSolutions = new ArrayList<>();
        for (int i = 0; i < refsetSize; i++) {
            var initializedSolution = this.newSolution(instance);
            var constructedSolution = this.constructive.construct(initializedSolution);
            var improvedSolution = this.improver.improve(constructedSolution);
            initialSolutions.add(improvedSolution);
        }
        return initialSolutions;
    }

    protected List<S> newSet(List<S> refset) {
        var newsize = (refset.size() * (refset.size() - 1)) / 2;
        var newset = new ArrayList<S>(newsize);
        for (int i = 0; i < refset.size() - 1; i++) {
            for (int j = i + 1; j < refset.size(); j++) {
                var combinedSolution = this.combinator.apply(refset.get(i), refset.get(j));
                combinedSolution.updateLastModifiedTime();
                newset.add(combinedSolution);
            }
        }
        return newset;
    }

    protected MergeResult<S> mergeSets(List<S> refset, List<S> newSet){
        newSet.sort(this.setSort);
        int leftIndex = 0, rightIndex = 0;
        var result = new ArrayList<S>();
        boolean modified = false;
        assert refset.size() == this.refsetSize;

        for (int i = 0; i < this.refsetSize; i++) {
            // The first two ifs should NEVER execute, leave them ready in case we allow
            // refset resizing in the future
            if(leftIndex >= refset.size()){
                throw new AssertionError("Refset emptied");
            } else if (rightIndex >= newSet.size()) {
                throw new AssertionError("Newset emptied");
            } else {
                S left = refset.get(leftIndex), right = newSet.get(rightIndex);
                if(left.isBetterThan(right)){
                    result.add(left);
                    leftIndex++;
                } else {
                    result.add(right);
                    rightIndex++;
                    modified = true;
                }
            }
        }
        return new MergeResult<>(modified, result);
    }

    protected record MergeResult<S> (boolean updated, List<S> refset){

    }

    @Override
    public String toString() {
        return "ScatterS{" +
                "n=" + refsetSize +
                ", const=" + constructive +
                ", impr=" + improver +
                ", comb=" + combinator +
                ", maxIter=" + maxIterations +
                '}';
    }
}
