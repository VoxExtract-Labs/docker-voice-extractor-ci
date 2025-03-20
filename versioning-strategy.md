# Docker Image Versioning and Auto-Push Strategy

This document outlines a strategy for versioning your Docker images and automatically pushing them to Docker Hub using a CI/CD pipeline (e.g., GitHub Actions).

---

## 1. Adopt a Versioning Strategy

### Semantic Versioning

- **Version Format:** Use semantic versioning (MAJOR.MINOR.PATCH).
- **Version File:** Create a `VERSION` file in the repository root that holds the current version.
- **Tagging:** Tag releases in Git (e.g., `v1.0.0`).
- **Automation:** Use tools like [bump2version](https://github.com/c4urself/bump2version) to automate version updates.

### Docker Labels

Include version metadata in your Dockerfile:

```dockerfile
LABEL version="1.0.0"
LABEL description="Your service description"
```

---

## 2. Automate Docker Image Builds and Pushes

### GitHub Actions Workflow Example

Create a workflow file at `.github/workflows/docker-build-push.yml` with the following content:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches:
      - main
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Extract version from VERSION file
        id: version
        run: |
          VERSION=$(cat VERSION)
          echo "VERSION=$VERSION" >> $GITHUB_ENV
          echo "::set-output name=VERSION::$VERSION"
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            yourusername/yourimagename:latest
            yourusername/yourimagename:${{ steps.version.outputs.VERSION }}
```

### Explanation of Workflow Steps

- **Triggering:** The workflow runs on pushes to the `main` branch, Git tags starting with `v` (e.g., `v1.0.0`), and manual triggers via `workflow_dispatch`.
- **Version Extraction:** The workflow reads the version from the `VERSION` file and makes it available for tagging the Docker image.
- **Docker Hub Login:** The action logs into Docker Hub using credentials stored as GitHub Secrets (`DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`).
- **Building and Pushing:** The Docker image is built from the repository and pushed to Docker Hub, tagged as `latest` and with the version from the `VERSION` file.

---

## 3. Best Practices

- **Automated Version Bumping:** Consider using a tool like `bump2version` to update your `VERSION` file and create Git tags automatically.
- **Testing Before Push:** Integrate automated tests or build validations in your CI/CD pipeline to ensure that images build successfully and function as expected before pushing them.
- **Release Management:** Use Git tags to denote official releases. Each tag corresponds to a specific version of your Docker image.
- **Security:** Keep your Docker Hub credentials secure by storing them as secrets in your CI/CD platform.

By following these documented steps, you can maintain a robust versioning strategy and automate the process of building and pushing Docker images to Docker Hub. This approach helps ensure consistency, traceability, and ease of deployment.

