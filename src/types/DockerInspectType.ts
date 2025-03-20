export default interface DockerInspectType {
    Id: string;
    RepoTags: string[];
    RepoDigests: unknown[];
    Parent: string;
    Comment: string;
    Created: string;
    Container: string;
    ContainerConfig: ContainerConfig;
    DockerVersion: string;
    Author: string;
    Config: Config;
    Architecture: string;
    Os: string;
    Size: number;
    VirtualSize: number;
    GraphDriver: GraphDriver;
    RootFS: RootFs;
    Metadata: Metadata;
}

interface ContainerConfig {
    Hostname: string;
    Domainname: string;
    User: string;
    AttachStdin: boolean;
    AttachStdout: boolean;
    AttachStderr: boolean;
    Tty: boolean;
    OpenStdin: boolean;
    StdinOnce: boolean;
    Env: unknown;
    Cmd: unknown;
    Image: string;
    Volumes: unknown;
    WorkingDir: string;
    Entrypoint: unknown;
    OnBuild: unknown;
    Labels: unknown;
}

interface Config {
    Hostname: string;
    Domainname: string;
    User: string;
    AttachStdin: boolean;
    AttachStdout: boolean;
    AttachStderr: boolean;
    ExposedPorts: ExposedPorts;
    Tty: boolean;
    OpenStdin: boolean;
    StdinOnce: boolean;
    Env: string[];
    Cmd: string[];
    ArgsEscaped: boolean;
    Image: string;
    Volumes: unknown;
    WorkingDir: string;
    Entrypoint: unknown;
    OnBuild: unknown;
    Labels: unknown;
}

interface ExposedPorts {
    '1025/tcp': N1025Tcp;
    '3306/tcp': N3306Tcp;
    '6379/tcp': N6379Tcp;
    '8025/tcp': N8025Tcp;
    '9000/tcp': N9000Tcp;
    '9001/tcp': N9001Tcp;
}

type N1025Tcp = object;

type N3306Tcp = object;

type N6379Tcp = object;

type N8025Tcp = object;

type N9000Tcp = object;

type N9001Tcp = object;

interface GraphDriver {
    Data: Data;
    Name: string;
}

interface Data {
    LowerDir: string;
    MergedDir: string;
    UpperDir: string;
    WorkDir: string;
}

interface RootFs {
    Type: string;
    Layers: string[];
}

interface Metadata {
    LastTagTime: string;
}
