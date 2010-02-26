# coding: utf-8

"""
    PyLucid blog plugin
    ~~~~~~~~~~~~~~~~~~~

    A simple blog system.

    http://feedvalidator.org/
    
    TODO:
        * Detail view, use BlogEntry.get_absolute_url()
    

    Last commit info:
    ~~~~~~~~~
    $LastChangedDate: 2009-08-11 14:02:53 +0200 (Di, 11 Aug 2009) $
    $Rev: 2263 $
    $Author: JensDiemer $

    :copyleft: 2008-2009 by the PyLucid team, see AUTHORS for more details.
    :license: GNU GPL v2 or above, see LICENSE for more details
"""

__version__ = "$Rev: 2263 $ Alpha"

# from python core
import os, datetime, posixpath

# from django
from django import http
from django.conf import settings
from django.core.mail import send_mail
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.contrib.sites.models import Site
from django.shortcuts import render_to_response
from django.utils.translation import ugettext as _
from django.views.decorators.csrf import csrf_protect
from django.contrib.comments.views.comments import post_comment

from pylucid.decorators import render_to

from lexicon.models import LexiconEntry, Links


def _get_filtered_queryset(request):
    current_lang = request.PYLUCID.language_entry
    queryset = LexiconEntry.on_site.filter(is_public=True).filter(language=current_lang)
    return queryset


def _add_breadcrumb(request, title, url):
    """ shortcut for add breadcrumb link """
    context = request.PYLUCID.context
    breadcrumb_context_middlewares = context["context_middlewares"]["breadcrumb"]
    # Blog entries have only a headline, use it for name and title
    breadcrumb_context_middlewares.add_link(title, title, url)


@render_to("lexicon/summary.html")
def summary(request):
    _add_breadcrumb(request, title="Lexicon summary", url=request.path)

    entries = _get_filtered_queryset(request)
    context = {
        "entries": entries
    }
    return context


@csrf_protect
@render_to("lexicon/detail_view.html")
def detail_view(request, term=None):
    if term is None:
        if request.user.is_staff:
            request.page_msg.error("Error: No term given.")
        return

    queryset = _get_filtered_queryset(request)
    entry = queryset.get(term=term)

    if request.POST:
        # Use django.contrib.comments.views.comments.post_comment to handle a comment
        # post.
        return post_comment(request, next=entry.get_absolute_url())

    _add_breadcrumb(request, title="%s: %s" % (entry.term, entry.short_definition), url=request.path)

    # Change permalink from the blog root page to this entry detail view
    permalink = entry.get_permalink(request)
    request.PYLUCID.context["page_permalink"] = permalink # for e.g. the HeadlineAnchor

    context = {
        "entry": entry,
        "page_permalink": permalink, # Change the permalink in the global page template
    }
    return context


@render_to("lexicon/detail_popup.html")
def http_get_view(request):
    term = request.GET["lexicon"]

    queryset = _get_filtered_queryset(request)
    entry = queryset.get(term=term)

    if request.POST:
        # Use django.contrib.comments.views.comments.post_comment to handle a comment
        # post.
        return post_comment(request, next=entry.get_absolute_url())

    context = {"entry": entry}
    return context
