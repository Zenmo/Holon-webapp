from typing import Union


class RepositoryBaseClass:
    """Repository containing all actors in memory"""

    objects: list = []

    def set_objects(self, objects):
        self.objects = objects

    def list(self):
        return self.objects

    def dict(self):
        return {obj.id: obj for obj in self.objects}

    def get(self, id: int) -> object:
        """Get an item in the objects list by id"""
        raise NotImplementedError()

    def filter(self, filter) -> Union[object, list[object]]:
        """Return one or more items based on a filter"""
        raise NotImplementedError()

    def add(self, object):
        """Add an object to the repository"""
        raise NotImplementedError()

    def remove(self, object):
        """Remove an item from the repository"""
        raise NotImplementedError()
