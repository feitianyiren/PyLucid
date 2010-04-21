#-----------------------------------------------------------------------------
# PyLucid bootstrap script START

"""
    PyLucid virtual environment bootstrap
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    This file would be merged into pylucid-boot.py with the
    script create_bootstrap_script.py
"""


LIBS = [
    # Python packages
    "feedparser", # http://pypi.python.org/pypi/FeedParser/    
    "Pygments", # http://pygments.org/ 

    # external Django apps
    "django-reversion", # http://code.google.com/p/django-reversion/ 
    "django-dbtemplates", # http://code.google.com/p/django-dbtemplates/ 
    "django-tagging", # http://code.google.com/p/django-tagging/ 
]

MENU_TXT = """
---------------------------------------------------------------------
Please select how the pylucid own projects should be checkout:

(1) Python packages from PyPi (no SVN or git needed)
(2) source via SVN only (checkout git repository via github svn gateway)
(3) source via git and clone with readonly
(4) source via git and clone writeable (Needs github pubkey auth!)
(5) abort
"""

PIP_INSTALL_DATA = {
    1: [# *** use python packages from PyPi
        "python-creole", "django-dbpreferences", "django-tools",
        "PyLucid",
        "Django"
    ],
    2: [# use SVN
        "-e", "http://svn.github.com/jedie/python-creole.git#egg=python-creole",
        "-e", "http://svn.github.com/jedie/django-dbpreferences.git#egg=dbpreferences",
        "-e", "http://svn.github.com/jedie/django-tools.git#egg=django-tools",
        "-e", "http://svn.github.com/jedie/PyLucid.git#egg=pylucid",
        # SVN Version from django:
        "-e", "svn+http://code.djangoproject.com/svn/django/trunk/#egg=django",
    ],
    3: [# git readonly clone
        "-e", "git+git://github.com/jedie/python-creole.git#egg=python-creole",
        "-e", "git+git://github.com/jedie/django-dbpreferences.git#egg=dbpreferences",
        "-e", "git+git://github.com/jedie/django-tools.git#egg=django-tools",
        "-e", "git+git://github.com/jedie/PyLucid.git#egg=pylucid",
        # SVN Version from django:
        "-e", "svn+http://code.djangoproject.com/svn/django/trunk/#egg=django",
    ],
    4: [ # git writeable clone
        # own sub projects
        "-e", "git+git@github.com:jedie/python-creole.git#egg=python-creole",
        "-e", "git+git@github.com:jedie/django-dbpreferences.git#egg=dbpreferences",
        "-e", "git+git@github.com:jedie/django-tools.git#egg=django-tools",
        "-e", "git+git@github.com:jedie/PyLucid.git#egg=pylucid",
        # SVN Version from django:
        "-e", "svn+http://code.djangoproject.com/svn/django/trunk/#egg=django",
    ]
}



def get_requirement_choice():
    """
    Display menu and select a number.
    """
    while True:
        print MENU_TXT

        try:
            input = raw_input("Please select: [1,2,3] (default: 1) ")
        except KeyboardInterrupt:
            sys.exit(-1)

        print
        if input == "":
            return 1
        try:
            number = int(input)
        except ValueError:
            print "Error: Input is not a number!"
        else:
            if number == 5:
                sys.exit(-1)
            elif number not in PIP_INSTALL_DATA:
                print "Error: %r is not a valid choise!" % number
            else:
                return number


def extend_parser(parser):
    """
    extend optparse options.
    """
    parser.add_option("-t", "--type", type = "int",
        dest = "pip_type", default = None,
        help = "pip install type (%r)" % ",".join([str(i) for i in PIP_INSTALL_DATA.keys()])
    )



def adjust_options(options, args):
    """
    You can change options here, or change the args (if you accept
    different kinds of arguments, be sure you modify ``args`` so it is
    only ``[DEST_DIR]``).
    """
    if options.pip_type == None:
        options.pip_type = get_requirement_choice()

    if options.pip_type not in PIP_INSTALL_DATA:
        print "pip type wrong!"
        sys.exit(101)


def after_install(options, home_dir):
    """
    called after virtualenv was created and setuptools installed.
    Now we installed PyLucid and used libs/packages.
    """
    defaults = {
        "cwd": os.path.join(home_dir, "bin"),
        "env": {
            "VIRTUAL_ENV": home_dir,
            "PATH": os.environ["PATH"],
        }
    }
    easy_install = os.path.join(home_dir, "bin", "easy_install")
    pip = os.path.join(home_dir, "bin", "pip")

    print "-" * 79
    print "install pip"
    subprocess.call([easy_install, '--always-copy', 'pip'], **defaults)

    PIP_LOG = os.path.join(home_dir, "PyLucid_pip.log")

    print "-" * 79
    print "install PyLucid libs"
    cmd = [pip, "install", "--verbose", "--log=%s" % PIP_LOG] + LIBS
    print " ".join(cmd)
    subprocess.call(cmd, **defaults)

    pip_type = options.pip_type
    pip_names = PIP_INSTALL_DATA[pip_type]

    print "-" * 79
    print "install PyLucid projects"
    cmd = [pip, "install", "--verbose", "--log=%s" % PIP_LOG] + pip_names
    print " ".join(cmd)
    subprocess.call(cmd, **defaults)


# PyLucid bootstrap script END
#-----------------------------------------------------------------------------
