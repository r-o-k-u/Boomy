# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present Boomy.us
"""

from flask import Blueprint

blueprint = Blueprint(
    'home_blueprint',
    __name__,
    url_prefix=''
)
