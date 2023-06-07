from __future__ import annotations
from abc import ABC
from typing import List, Type, Union
import numpy as np
from holon.models.filter import Filter
from src.holon.models.filter_subselector import FilterSubSelector


class RepositoryBaseClass(ABC):
    """Repository containing all actors in memory"""

    objects: list[object] = []

    def set_objects(self, objects):
        self.objects = objects

    def dict(self):
        return {obj.id: obj for obj in self.objects}

    def clone(self) -> RepositoryBaseClass:
        """Clone the object"""
        raise NotImplementedError()

    def get(self, id: int) -> object:
        """Get an item in the objects list by id"""
        raise NotImplementedError()

    def filter_model_subtype(self, model_subtype: Type):
        """Keep only items in the repository that match with a certain filter"""
        raise NotImplementedError()

    def filter(self, filter):
        """Keep only items in the repository that match with a certain filter"""
        raise NotImplementedError()

    def all(self) -> list[object]:
        """Return all objects in the repository"""
        return self.objects

    def add(self, object):
        """Add an object to the repository"""
        raise NotImplementedError()

    def remove(self, object):
        """Remove an item from the repository"""
        raise NotImplementedError()
