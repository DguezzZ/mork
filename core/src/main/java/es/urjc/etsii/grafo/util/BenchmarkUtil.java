package es.urjc.etsii.grafo.util;

import jnt.scimark2.ScimarkAPI;

/**
 * Benchmark helper methods
 */
public class BenchmarkUtil {
    /**
     * Run a small benchmark and return score.
     *
     * @return score as a double
     */
    public static double getBenchmarkScore(int seed){
        var result = ScimarkAPI.runBenchmark(seed);
        return result.getScore();
    }
}
