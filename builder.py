SCRIPTS_TO_STRINGIFY = [
    'aes.js',
    'buffer.js',
    'setImmediate.js',
    'unorm.js',
    'scrypt.js',
    'encrypt.js',
]

ROOT_SCRIPT = 'vkrypt.js'
OUTPUT = 'vkrypt_build.js'
VAR_NAME = 'VKRYPT'


def build():
    out = []
    for script in SCRIPTS_TO_STRINGIFY:
        with open(script) as f:
            out.append(f.read().replace('`', '"'))

    out = 'var {} = `'.format(VAR_NAME) + '\n'.join(out) + '`'
    with open(ROOT_SCRIPT) as f:
        out += '\n' + f.read()

    with open(OUTPUT, 'w') as f:
        f.write(out)


if __name__ == '__main__':
    build()
