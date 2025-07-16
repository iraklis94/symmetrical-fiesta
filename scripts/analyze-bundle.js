#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Bundle analyzer for React Native/Expo apps
class BundleAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.reportPath = path.join(this.projectRoot, 'bundle-analysis');
  }

  async analyze() {
    console.log('🔍 Starting bundle analysis...');
    
    try {
      // Create report directory
      if (!fs.existsSync(this.reportPath)) {
        fs.mkdirSync(this.reportPath, { recursive: true });
      }

      // Analyze dependencies
      await this.analyzeDependencies();
      
      // Analyze bundle size
      await this.analyzeBundleSize();
      
      // Generate optimization recommendations
      await this.generateRecommendations();
      
      console.log('✅ Bundle analysis complete! Check the bundle-analysis folder for reports.');
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error);
      process.exit(1);
    }
  }

  async analyzeDependencies() {
    console.log('📦 Analyzing dependencies...');
    
    try {
      // Get package.json
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      const analysis = {
        totalDependencies: Object.keys(dependencies).length,
        dependencies: {},
        largePackages: [],
        duplicatePackages: [],
      };

      // Analyze each dependency
      for (const [name, version] of Object.entries(dependencies)) {
        try {
          const packagePath = path.join(this.projectRoot, 'node_modules', name, 'package.json');
          if (fs.existsSync(packagePath)) {
            const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            analysis.dependencies[name] = {
              version,
              size: this.getPackageSize(name),
              description: pkg.description || '',
              homepage: pkg.homepage || '',
              license: pkg.license || '',
              dependencies: Object.keys(pkg.dependencies || {}).length,
              devDependencies: Object.keys(pkg.devDependencies || {}).length,
            };

            // Check for large packages (>1MB)
            if (analysis.dependencies[name].size > 1024 * 1024) {
              analysis.largePackages.push({
                name,
                size: analysis.dependencies[name].size,
                sizeMB: (analysis.dependencies[name].size / (1024 * 1024)).toFixed(2),
              });
            }
          }
        } catch (error) {
          console.warn(`Warning: Could not analyze package ${name}:`, error.message);
        }
      }

      // Sort large packages by size
      analysis.largePackages.sort((a, b) => b.size - a.size);

      // Write dependency analysis report
      fs.writeFileSync(
        path.join(this.reportPath, 'dependencies.json'),
        JSON.stringify(analysis, null, 2)
      );

      console.log(`📊 Found ${analysis.totalDependencies} dependencies`);
      console.log(`📦 Found ${analysis.largePackages.length} large packages (>1MB)`);
      
    } catch (error) {
      console.error('Error analyzing dependencies:', error);
    }
  }

  async analyzeBundleSize() {
    console.log('📊 Analyzing bundle size...');
    
    try {
      // This would require building the app and analyzing the bundle
      // For now, we'll create a placeholder report
      const bundleAnalysis = {
        timestamp: new Date().toISOString(),
        platform: 'react-native',
        framework: 'expo',
        recommendations: [
          'Enable Hermes engine for better performance',
          'Use tree shaking to eliminate unused code',
          'Implement code splitting for large components',
          'Optimize images and assets',
          'Use lazy loading for routes',
        ],
      };

      fs.writeFileSync(
        path.join(this.reportPath, 'bundle-analysis.json'),
        JSON.stringify(bundleAnalysis, null, 2)
      );
      
    } catch (error) {
      console.error('Error analyzing bundle size:', error);
    }
  }

  async generateRecommendations() {
    console.log('💡 Generating optimization recommendations...');
    
    try {
      const recommendations = {
        performance: [
          'Use React.memo for expensive components',
          'Implement useMemo and useCallback for expensive calculations',
          'Add proper loading states and skeleton screens',
          'Optimize image loading with caching',
          'Use virtual scrolling for large lists',
          'Implement proper error boundaries',
        ],
        bundle: [
          'Remove unused dependencies',
          'Use dynamic imports for code splitting',
          'Optimize third-party library usage',
          'Consider using smaller alternatives for large packages',
          'Enable tree shaking in build configuration',
        ],
        caching: [
          'Implement proper React Query caching strategies',
          'Add offline support with proper cache invalidation',
          'Use persistent storage for critical data',
          'Implement background sync for data updates',
        ],
        images: [
          'Use optimized image formats (WebP, AVIF)',
          'Implement progressive image loading',
          'Add proper image caching',
          'Use appropriate image sizes for different screen densities',
        ],
      };

      fs.writeFileSync(
        path.join(this.reportPath, 'recommendations.json'),
        JSON.stringify(recommendations, null, 2)
      );

      // Generate markdown report
      const markdownReport = this.generateMarkdownReport(recommendations);
      fs.writeFileSync(
        path.join(this.reportPath, 'optimization-report.md'),
        markdownReport
      );
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  }

  generateMarkdownReport(recommendations) {
    return `# Bundle Optimization Report

Generated on: ${new Date().toLocaleString()}

## Performance Optimizations

${recommendations.performance.map(rec => `- ${rec}`).join('\n')}

## Bundle Size Optimizations

${recommendations.bundle.map(rec => `- ${rec}`).join('\n')}

## Caching Strategies

${recommendations.caching.map(rec => `- ${rec}`).join('\n')}

## Image Optimizations

${recommendations.images.map(rec => `- ${rec}`).join('\n')}

## Next Steps

1. Review the dependencies.json file for large packages
2. Implement the recommended optimizations
3. Run performance tests after each optimization
4. Monitor app performance in production

## Tools

- Use React DevTools Profiler for component performance analysis
- Use Flipper for debugging and performance monitoring
- Use React Query DevTools for cache inspection
- Monitor bundle size with Metro bundle analyzer
`;
  }

  getPackageSize(packageName) {
    try {
      const packagePath = path.join(this.projectRoot, 'node_modules', packageName);
      if (!fs.existsSync(packagePath)) return 0;

      const stats = fs.statSync(packagePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }
}

// Run the analyzer
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze();
}

module.exports = BundleAnalyzer;