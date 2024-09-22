# Experiments

Experiments provide a way to guard features and changes under a variable controlled by remote config.
We are currently using firebase remote config to implement the support to have experiments.

## Usage

Fetch and activate the configs somewhere before guarding the changes under these experiments. We are fetching these configs at the root level using a RootWrapper component.

Eg

```
import { fetchAndActivate } from "firebase/remote-config";
import useRemoteConfig from "@/lib/hooks/useRemoteConfig";
...

const ParentComponent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    ...
    const [remoteConfig, , , remoteConfigPromise] = useRemoteConfig();

    useEffect(() => {
        remoteConfigPromise && fetchAndActivate(remoteConfig)
    }).then(() => {...}).catch((e)=> {...})
}

export default ParentComponent;
```

Then use the experiment:

```
import useRemoteConfig from "@/lib/hooks/useRemoteConfig";
...

const ChildComponent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

  const [, isExperimentEnabled] = useRemoteConfig();

  return (<div>
    {isExperimentEnabled(EXPERIMENT_NAMES.TEST_EXPERIMENT_NAME) ? (
          <p>Experiment is enabled</p>
        ) : (
          <>Experiment is not enabled</>
    )}
  </div>)

}

export default ChildComponent;
```
