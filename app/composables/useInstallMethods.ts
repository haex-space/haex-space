export type LinuxInstallMethodKey = 'apt' | 'dnf' | 'zypper' | 'pacman'

export interface LinuxInstallMethod {
  key: LinuxInstallMethodKey
  /** Short label for tab triggers (technical name, identical across locales) */
  tabLabel: string
  /** i18n key prefix — combine with .title / .description / .updateNote */
  i18nBase: string
  /** Bash snippet shown in the code block */
  snippet: string
  /** Short shell command displayed next to the updateNote line */
  updateCmd: string
}

function defineMethod(
  key: LinuxInstallMethodKey,
  rest: Omit<LinuxInstallMethod, 'key' | 'i18nBase'>,
): LinuxInstallMethod {
  return { key, i18nBase: `installMethods.linux.${key}`, ...rest }
}

/**
 * Single source of truth for the Linux package-manager install snippets.
 *
 * Consumed by both `/install` (rendered as stacked Cards) and
 * `/download` via `InstallMethods.vue` (rendered as Tabs). Snippets are
 * static; locale-aware copy lives under `installMethods.linux.<key>.*`
 * in the i18n bundle, looked up by the consumer with `t(method.i18nBase + '.title')`.
 *
 * Edit snippets here once; both pages pick up the change.
 */
export function useInstallMethods(): { linux: LinuxInstallMethod[] } {
  const apt = defineMethod('apt', {
    tabLabel: 'APT',
    updateCmd: 'sudo apt update && sudo apt upgrade',
    snippet: `# 1. Trust the repo signing key
sudo install -d -m 0755 /etc/apt/keyrings
curl -fsSL https://apt.haex.space/pubkey.gpg \\
  | sudo tee /etc/apt/keyrings/haex-vault.asc > /dev/null

# 2. Add the repository
echo "deb [arch=amd64,arm64 signed-by=/etc/apt/keyrings/haex-vault.asc] https://apt.haex.space stable main" \\
  | sudo tee /etc/apt/sources.list.d/haex-vault.list > /dev/null

# 3. Install
sudo apt update
sudo apt install haex-vault`,
  })

  const dnf = defineMethod('dnf', {
    tabLabel: 'DNF/YUM',
    updateCmd: 'sudo dnf upgrade haex-vault',
    snippet: `# 1. Trust the repo signing key
sudo rpm --import https://rpm.haex.space/pubkey.gpg

# 2. Add the repository
sudo tee /etc/yum.repos.d/haex-vault.repo > /dev/null <<'EOF'
[haex-vault]
name=Haex Vault
baseurl=https://rpm.haex.space/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://rpm.haex.space/pubkey.gpg
EOF

# 3. Install
sudo dnf install haex-vault`,
  })

  const zypper = defineMethod('zypper', {
    tabLabel: 'Zypper',
    updateCmd: 'sudo zypper update haex-vault',
    snippet: `sudo rpm --import https://rpm.haex.space/pubkey.gpg
sudo zypper addrepo --gpgcheck --refresh \\
  https://rpm.haex.space/ haex-vault
sudo zypper install haex-vault`,
  })

  const pacman = defineMethod('pacman', {
    tabLabel: 'Pacman',
    updateCmd: 'sudo pacman -Syu',
    snippet: `# 1. Trust the repo signing key
#    Fingerprint: 92B1 6ADF 139D F0D5 BA0B  2C8A 7940 193A 39D0 D4EA
curl -fsSL https://arch.haex.space/pubkey.gpg -o /tmp/haex.gpg
gpg --show-keys /tmp/haex.gpg   # cross-check the fingerprint
sudo pacman-key --add /tmp/haex.gpg
sudo pacman-key --lsign-key 92B16ADF139DF0D5BA0B2C8A7940193A39D0D4EA
rm /tmp/haex.gpg

# 2. Add the repository to /etc/pacman.conf (skip if [haex-vault] section already present)
grep -qFx '[haex-vault]' /etc/pacman.conf || printf '%s\\n' '' '[haex-vault]' 'SigLevel = Required DatabaseRequired' 'Server = https://arch.haex.space/$arch' | sudo tee -a /etc/pacman.conf > /dev/null

# 3. Install
sudo pacman -Syu haex-vault`,
  })

  return {
    linux: [apt, dnf, zypper, pacman],
  }
}
