<script setup>
import { onMounted } from 'vue'

// replace the random token on each reload so we don't have a security problem with people using the same token across Caby instances
function randomToken(len = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: len }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

onMounted(() => {
  document.querySelectorAll('code').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/loading\.\.\./g, randomToken())
  })
})
</script>

# Configuration

You'll need to configure spaces and users:

- Spaces represent compartments of files to help your organize by purpose or access.
- Users, of course, help us give people access to those spaces.

:::warning
The main config file is in active development and unstable at the moment. Some of these fields don't do anything and others will likely move or be renamed. Keep an eye on this page between updates to stay on top of those changes.
:::

```yaml [config.yaml]
# config.yaml

spaces:
    # a unique name for the space that determines the path on the filesystem
    # (e.g. 'home' -> 'cabynet/spaces/home')
  - name: home
    # overrides how the space is displayed in the UI; can include emojis
    display: 🏠 Home
    # note how only the name is required for a space
  - name: media
users:
    # the username of the user; functions like an ID so it needs to be unique
    # for each user
  - name: caby_guy
    # an optional email for the user
    email: caby_guy@caby.io
    # 64-character string used to activate the user's account on first login
    activation_token: loading...
    # the spaces this user should have access to
    spaces:
      - name: home
        permissions: "*"

```
