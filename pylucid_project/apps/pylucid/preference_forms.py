# coding: utf-8

import warnings

from django import forms
from django.contrib.messages import constants as message_constants
from django.utils.translation import ugettext_lazy as _

from dbpreferences.forms import DBPreferencesBaseForm

from pylucid_project.apps.pylucid.models import Design

#if Language.objects.count() == 0:
#    # FIXME: Insert first language
#    Language(code="en", description="english").save()
#    warnings.warn("First language 'en' created.")


class SystemPreferencesForm(DBPreferencesBaseForm):
    """ test preferences form """

    # We can't use ModelChoiceField here, is not supported in DBpreferences, yet.
    # see: http://code.google.com/p/django-dbpreferences/issues/detail?id=4
    pylucid_admin_design = forms.ChoiceField(
        # choices= Set in __init__, so the Queryset would not execute at startup
        initial=None,
        help_text=_("ID of the PyLucid Admin Design. (Not used yet!)")
    )
    ban_release_time = forms.IntegerField(
        help_text=_("How long should a IP address banned in minutes. (Changes need app restart)"),
        initial=15, min_value=1, max_value=60 * 24 * 7
    )

    PERMALINK_USE_NONE = "nothing"
    PERMALINK_USE_SLUG = "slug"
    PERMALINK_USE_NAME = "name"
    PERMALINK_USE_TITLE = "title"
    PERMALINK_USE_CHOICES = (
        (PERMALINK_USE_NONE, _("Append no additional text")),
        (PERMALINK_USE_SLUG, _("Append the PageTree slug (language independent)")),
        (PERMALINK_USE_NAME, _("Append the PageMeta name (language dependent)")),
        (PERMALINK_USE_TITLE, _("Append the PageMeta title (language dependent)")),
    )
    permalink_additions = forms.ChoiceField(
        choices=PERMALINK_USE_CHOICES,
        initial=PERMALINK_USE_TITLE,
        help_text=_("Should we append a additional text to every permalink?")
    )

    # Used in pylucid_project.middlewares.pylucid_objects.py
    LOG404_NOTHING = "nothing"
    LOG404_NOREDIRECT = "no_redirect"
    LOG404_EVERYTHING = "everything"
    LOG404_CHOICES = (
        (LOG404_NOTHING, _("Don't log 'Page not found' errors.")),
        (LOG404_NOREDIRECT, _("Log only 'Page not found' if no redirect for the url exists.")),
        (LOG404_EVERYTHING, _("Log every 'Page not found' error, although if redirect exists.")),
    )
    log404_verbosity = forms.ChoiceField(
        choices=LOG404_CHOICES,
        initial=LOG404_NOREDIRECT,
        help_text=_("Setup logging verbosity if 404 - 'Page not found' appears")
    )

    MESSAGE_LEVEL_CHOICES = (
        (message_constants.DEBUG, "Debug (%s)" % message_constants.DEBUG),
        (message_constants.INFO, "Info (%s)" % message_constants.INFO),
        (message_constants.SUCCESS, "Success (%s)" % message_constants.SUCCESS),
        (message_constants.WARNING, "Warning (%s)" % message_constants.WARNING),
        (message_constants.ERROR, "Error (%s)" % message_constants.ERROR),
    )
    message_level_anonymous = forms.ChoiceField(
        choices=MESSAGE_LEVEL_CHOICES,
        initial=message_constants.SUCCESS,
        help_text=_("Set django message level for anonymous user to set the minimum message that will be displayed.")
    )
    message_level_normalusers = forms.ChoiceField(
        choices=MESSAGE_LEVEL_CHOICES,
        initial=message_constants.INFO,
        help_text=_("Set django message level for normal users to set the minimum message that will be displayed.")
    )
    message_level_staff = forms.ChoiceField(
        choices=MESSAGE_LEVEL_CHOICES,
        initial=message_constants.DEBUG,
        help_text=_("Set django message level for staff users to set the minimum message that will be displayed.")
    )
    message_level_superuser = forms.ChoiceField(
        choices=MESSAGE_LEVEL_CHOICES,
        initial=message_constants.DEBUG,
        help_text=_("Set django message level for superusers to set the minimum message that will be displayed.")
    )

    def __init__(self, *args, **kwargs):
        super(SystemPreferencesForm, self).__init__(*args, **kwargs)
        existing_designs = Design.on_site.all().values_list("id", "name")

        self.fields['pylucid_admin_design'].choices = existing_designs

        # Fallback if admin design not set
        initial = existing_designs[0][0]
        for id, name in existing_designs:
            if name == "PyLucid Admin":
                initial = id
                break

        self.fields['pylucid_admin_design'].initial = initial

    class Meta:
        app_label = 'pylucid'
