<template>
  <div 
    class="loading-spinner"
    :class="{ 
      [`loading-spinner--${size}`]: size !== 'medium',
      [`loading-spinner--${variant}`]: variant !== 'primary' 
    }"
    role="status"
    :aria-label="ariaLabel"
  >
    <div class="spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    
    <p v-if="message" class="loading-message">
      {{ message }}
    </p>
    
    <!-- Screen reader text -->
    <span class="sr-only">{{ srText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Component Props
interface Props {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'light'
  message?: string
  ariaLabel?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  variant: 'primary',
  message: '',
  ariaLabel: 'Loading content'
})

// Computed properties
const srText = computed(() => {
  return props.message || 'Loading, please wait...'
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.spinner {
  position: relative;
  display: inline-block;
}

/* Default medium size */
.spinner {
  width: 40px;
  height: 40px;
}

.spinner-ring {
  position: absolute;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  width: 100%;
  height: 100%;
  border-top-color: #667eea;
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  width: 85%;
  height: 85%;
  top: 7.5%;
  left: 7.5%;
  border-top-color: #764ba2;
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border-top-color: #f093fb;
  animation-delay: -0.15s;
}

/* Size variations */
.loading-spinner--small .spinner {
  width: 24px;
  height: 24px;
}

.loading-spinner--small .spinner-ring {
  border-width: 2px;
}

.loading-spinner--large .spinner {
  width: 64px;
  height: 64px;
}

.loading-spinner--large .spinner-ring {
  border-width: 4px;
}

/* Variant colors */
.loading-spinner--secondary .spinner-ring:nth-child(1) {
  border-top-color: #4a5568;
}

.loading-spinner--secondary .spinner-ring:nth-child(2) {
  border-top-color: #718096;
}

.loading-spinner--secondary .spinner-ring:nth-child(3) {
  border-top-color: #a0aec0;
}

.loading-spinner--light .spinner-ring:nth-child(1) {
  border-top-color: rgba(255, 255, 255, 0.8);
}

.loading-spinner--light .spinner-ring:nth-child(2) {
  border-top-color: rgba(255, 255, 255, 0.6);
}

.loading-spinner--light .spinner-ring:nth-child(3) {
  border-top-color: rgba(255, 255, 255, 0.4);
}

.loading-message {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #4a5568;
  text-align: center;
  font-weight: 500;
  max-width: 200px;
  line-height: 1.4;
}

.loading-spinner--light .loading-message {
  color: rgba(255, 255, 255, 0.9);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spinner-ring {
    animation-duration: 2s;
  }
}

/* Focus styles for accessibility */
.loading-spinner:focus {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>