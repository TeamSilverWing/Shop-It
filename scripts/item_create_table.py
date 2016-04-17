from peewee import *
import config

db = MySQLDatabase(config.db, user=config.user,passwd=config.password)

class Item(peewee.Model):
    author = peewee.CharField()
    title = peewee.TextField()

    class Meta:
        database = db
