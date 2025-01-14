package es.urjc.etsii.grafo.io.serializers;

import es.urjc.etsii.grafo.io.Instance;
import es.urjc.etsii.grafo.solution.Solution;
import es.urjc.etsii.grafo.solver.annotations.InheritedComponent;
import es.urjc.etsii.grafo.solver.services.events.types.SolutionGeneratedEvent;

import java.nio.file.Path;
import java.util.List;

/**
 * This class handles the transformation of the results of the experiments to a file in a specific format.
 */
@InheritedComponent
public abstract class ResultsSerializer<S extends Solution<S,I>, I extends Instance> {

    /**
     * Serializer config
     */
    protected final AbstractResultSerializerConfig config;

    /**
     * Construct a result serializer given a specific configuration. {@see AbstractResultSerializerConfig.java}
     * @param config serializer configuration
     */
    public ResultsSerializer(AbstractResultSerializerConfig config) {
        this.config = config;
    }

    /**
     * Get current serializer configuration
     * @return serializer configuration
     */
    public AbstractResultSerializerConfig getConfig(){
        return this.config;
    }

    /**
     * Write experiment results to disk using the provided event list
     * @param results Result data as a list of events.
     * @param p Path where results file should be written. Could be a folder depending on the serializer.
     */
    public void serializeResults(List<SolutionGeneratedEvent<S, I>> results, Path p){
        this._serializeResults(results, p);
    }

    /**
     * This procedure serialize the list of results to a specific format and generate the resultant file in a given path
     *
     * @param results list of results
     * @param p       path
     */
    protected abstract void _serializeResults(List<SolutionGeneratedEvent<S, I>> results, Path p);


}
