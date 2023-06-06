class RepositoryBaseClass:
    """Repository containing all actors in memory"""

    objects = []

    def set_objects(self, objects):
        self.objects = objects

    def list(self):
        return self.objects

    def dict(self):
        return {obj.id: obj for obj in self.objects}
