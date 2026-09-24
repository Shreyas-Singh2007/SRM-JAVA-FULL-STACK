import java.util.ArrayList;
import java.util.List;

public class InventoryManager {

    private List<Product> products;
    private List<Category> categories;

    // ANSI Color Codes
    public static final String RESET = "\u001B[0m";
    public static final String RED = "\u001B[31m";
    public static final String YELLOW = "\u001B[33m";
    public static final String CYAN = "\u001B[36m";

    public InventoryManager() {
        products = FileManager.loadProducts();
        categories = FileManager.loadCategories();
    }

    // =========================================================
    // PRODUCT OPERATIONS
    // =========================================================

    public boolean addProduct(Product product) {
        if (findProductById(product.getId()) != null) {
            return false;
        }
        products.add(product);
        FileManager.saveProducts(products);
        return true;
    }

    public void displayProducts() {
        if (products.isEmpty()) {
            System.out.println(RED + "\n  ✗ No products available." + RESET);
            return;
        }

        System.out.println(CYAN + "\n╭───────────────────────────────────────────────────────────────────────────────────╮" + RESET);
        System.out.println(CYAN + "│" + RESET + String.format(" %-5s │ %-20s │ %-15s │ %-10s │ %-7s │ %-10s ", "ID", "Name", "Category", "Price", "Stock", "Status") + CYAN + "│" + RESET);
        System.out.println(CYAN + "├───────┼──────────────────────┼─────────────────┼────────────┼─────────┼────────────┤" + RESET);

        for (Product product : products) {
            String status = product.getStock() <= 5 ? RED + "[LOW STOCK]" + RESET : "OK";
            String pStr = String.format(" %-5d │ %-20s │ %-15s │ $%-9.2f │ %-7d │ %-19s",
                    product.getId(),
                    truncate(product.getName(), 20),
                    truncate(product.getCategory(), 15),
                    product.getPrice(),
                    product.getStock(),
                    status);
            System.out.println(CYAN + "│" + RESET + pStr + CYAN + "│" + RESET);
        }

        System.out.println(CYAN + "╰───────┴──────────────────────┴─────────────────┴────────────┴─────────┴────────────╯" + RESET);
    }

    private String truncate(String text, int length) {
        if (text.length() <= length) return text;
        return text.substring(0, length - 3) + "...";
    }

    public Product findProductById(int id) {
        for (Product product : products) {
            if (product.getId() == id) {
                return product;
            }
        }
        return null;
    }

    public void searchProduct(String name) {
        boolean found = false;
        for (Product product : products) {
            if (product.getName().toLowerCase().contains(name.toLowerCase())) {
                System.out.println(CYAN + "  " + product + RESET);
                found = true;
            }
        }
        if (!found) {
            System.out.println(RED + "  ✗ Product not found." + RESET);
        }
    }

    public boolean updateProduct(int id, String name, String category, double price) {
        Product product = findProductById(id);
        if (product == null) {
            return false;
        }
        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        FileManager.saveProducts(products);
        return true;
    }

    public boolean deleteProduct(int id) {
        Product product = findProductById(id);
        if (product == null) {
            return false;
        }
        products.remove(product);
        FileManager.saveProducts(products);
        return true;
    }

    // =========================================================
    // STOCK OPERATIONS
    // =========================================================

    public boolean addStock(int productId, int quantity) {
        Product product = findProductById(productId);
        if (product == null || quantity <= 0) {
            return false;
        }
        product.setStock(product.getStock() + quantity);
        FileManager.saveProducts(products);
        return true;
    }

    public boolean removeStock(int productId, int quantity) {
        Product product = findProductById(productId);
        if (product == null || quantity <= 0) {
            return false;
        }
        if (product.getStock() < quantity) {
            return false;
        }
        product.setStock(product.getStock() - quantity);
        FileManager.saveProducts(products);
        return true;
    }

    public void displayLowStock(int limit) {
        boolean found = false;
        System.out.println(RED + "\n╭───────────── LOW STOCK PRODUCTS ─────────────╮" + RESET);
        for (Product product : products) {
            if (product.getStock() <= limit) {
                System.out.println("  " + product);
                found = true;
            }
        }
        if (!found) {
            System.out.println("  No low-stock products.");
        }
        System.out.println(RED + "╰──────────────────────────────────────────────╯" + RESET);
    }

    // =========================================================
    // CATEGORY OPERATIONS
    // =========================================================

    public boolean addCategory(Category category) {
        if (findCategoryById(category.getId()) != null) {
            return false;
        }
        categories.add(category);
        FileManager.saveCategories(categories);
        return true;
    }

    public void displayCategories() {
        if (categories.isEmpty()) {
            System.out.println(RED + "\n  ✗ No categories available." + RESET);
            return;
        }
        System.out.println(YELLOW + "\n╭─────── CATEGORY LIST ────────╮" + RESET);
        System.out.println(YELLOW + "│" + RESET + String.format(" %-5s │ %-20s ", "ID", "Name") + YELLOW + "│" + RESET);
        System.out.println(YELLOW + "├───────┼──────────────────────┤" + RESET);
        for (Category category : categories) {
            String cStr = String.format(" %-5d │ %-20s ", category.getId(), truncate(category.getName(), 20));
            System.out.println(YELLOW + "│" + RESET + cStr + YELLOW + "│" + RESET);
        }
        System.out.println(YELLOW + "╰───────┴──────────────────────╯" + RESET);
    }

    public Category findCategoryById(int id) {
        for (Category category : categories) {
            if (category.getId() == id) {
                return category;
            }
        }
        return null;
    }

    public boolean updateCategory(int id, String name) {
        Category category = findCategoryById(id);
        if (category == null) {
            return false;
        }
        category.setName(name);
        FileManager.saveCategories(categories);
        return true;
    }

    public boolean deleteCategory(int id) {
        Category category = findCategoryById(id);
        if (category == null) {
            return false;
        }
        for (Product product : products) {
            if (product.getCategory().equalsIgnoreCase(category.getName())) {
                return false;
            }
        }
        categories.remove(category);
        FileManager.saveCategories(categories);
        return true;
    }

    // =========================================================
    // UTILITY METHODS
    // =========================================================

    public int getNextProductId() {
        int maxId = 0;
        for (Product product : products) {
            if (product.getId() > maxId) {
                maxId = product.getId();
            }
        }
        return maxId + 1;
    }

    public int getNextCategoryId() {
        int maxId = 0;
        for (Category category : categories) {
            if (category.getId() > maxId) {
                maxId = category.getId();
            }
        }
        return maxId + 1;
    }
}