for i in [
    "java.lang.NullPointerException: Name is null",
    "\tat java.base/java.lang.Enum.valueOf(Unknown Source)",
    "\tat base.OL_ActorType.valueOf(OL_ActorType.java:1)",
    "\tat base.Main.f_createActors(Main.java:5176)",
    "\tat base.Main.f_configureBackBone(Main.java:4522)",
    "\tat base.Main.onStartup(Main.java:6246)",
    "\tat com.anylogic.engine.Agent.c(Unknown Source)",
    "\tat com.anylogic.engine.Agent.start(Unknown Source)",
    "\tat com.anylogic.engine.Engine.start(Unknown Source)",
    "\tat com.anylogic.cloud.executor.connector.ExperimentSimple.run(ExperimentSimple.java:105)",
    "\tat com.anylogic.cloud.executor.connector.ExperimentSimple.startRun(ExperimentSimple.java:221)",
]:
    print(i)
