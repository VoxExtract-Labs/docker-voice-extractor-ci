
export default interface DockerInspectType {
    Id: string
    RepoTags: string[]
    RepoDigests: any[]
    Parent: string
    Comment: string
    Created: string
    Container: string
    ContainerConfig: ContainerConfig
    DockerVersion: string
    Author: string
    Config: Config
    Architecture: string
    Os: string
    Size: number
    VirtualSize: number
    GraphDriver: GraphDriver
    RootFS: RootFs
    Metadata: Metadata
}

interface ContainerConfig {
    Hostname: string
    Domainname: string
    User: string
    AttachStdin: boolean
    AttachStdout: boolean
    AttachStderr: boolean
    Tty: boolean
    OpenStdin: boolean
    StdinOnce: boolean
    Env: any
    Cmd: any
    Image: string
    Volumes: any
    WorkingDir: string
    Entrypoint: any
    OnBuild: any
    Labels: any
}

interface Config {
    Hostname: string
    Domainname: string
    User: string
    AttachStdin: boolean
    AttachStdout: boolean
    AttachStderr: boolean
    ExposedPorts: ExposedPorts
    Tty: boolean
    OpenStdin: boolean
    StdinOnce: boolean
    Env: string[]
    Cmd: string[]
    ArgsEscaped: boolean
    Image: string
    Volumes: any
    WorkingDir: string
    Entrypoint: any
    OnBuild: any
    Labels: any
}

interface ExposedPorts {
    "1025/tcp": N1025Tcp
    "3306/tcp": N3306Tcp
    "6379/tcp": N6379Tcp
    "8025/tcp": N8025Tcp
    "9000/tcp": N9000Tcp
    "9001/tcp": N9001Tcp
}

interface N1025Tcp {}

interface N3306Tcp {}

interface N6379Tcp {}

interface N8025Tcp {}

interface N9000Tcp {}

interface N9001Tcp {}

interface GraphDriver {
    Data: Data
    Name: string
}

interface Data {
    LowerDir: string
    MergedDir: string
    UpperDir: string
    WorkDir: string
}

interface RootFs {
    Type: string
    Layers: string[]
}

interface Metadata {
    LastTagTime: string
}
